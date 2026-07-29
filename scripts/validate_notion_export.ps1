$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]
$sourceMapPath = Join-Path $root 'notion-source-map.json'
$rawPagesPath = Join-Path $root 'data/notion-export/raw-page-fetches'
$rawDatabasePath = Join-Path $root 'data/notion-export/raw-database-fetches'

if (-not (Test-Path -LiteralPath $sourceMapPath)) {
    Write-Host 'Notion export validation failed:'
    Write-Host '- Missing notion-source-map.json'
    exit 1
}

$sourceMap = Get-Content -Raw -LiteralPath $sourceMapPath | ConvertFrom-Json
$mappedPages = @($sourceMap.core_pages) + @($sourceMap.raw_input_pages)
$expectedRawFiles = New-Object System.Collections.Generic.List[string]

foreach ($page in $mappedPages) {
    $slug = [regex]::Replace($page.title.ToLowerInvariant(), '[^a-z0-9]+', '-').Trim('-')
    $relativePath = "data/notion-export/raw-page-fetches/$slug.json"
    $expectedRawFiles.Add($relativePath)
    $fullPath = Join-Path $root $relativePath

    if (-not (Test-Path -LiteralPath $fullPath)) {
        $failures.Add("Missing raw Notion fetch: $relativePath")
        continue
    }

    try {
        $rawFetch = Get-Content -Raw -LiteralPath $fullPath | ConvertFrom-Json
    } catch {
        $failures.Add("Invalid raw Notion JSON: $relativePath")
        continue
    }

    if (-not $rawFetch.metadata.type -or -not $rawFetch.url -or -not $rawFetch.text) {
        $failures.Add("Incomplete raw Notion fetch envelope: $relativePath")
    }
    if ($rawFetch.url -notlike "*$($page.id)*") {
        $failures.Add("Raw Notion fetch does not match mapped ID $($page.id): $relativePath")
    }
}

if ($expectedRawFiles.Count -ne 24) {
    $failures.Add("Expected 24 mapped Notion assets; found $($expectedRawFiles.Count)")
}

$actualRawFiles = @(Get-ChildItem -LiteralPath $rawPagesPath -File -Filter '*.json')
if ($actualRawFiles.Count -ne 24) {
    $failures.Add("Expected 24 raw page/database fetch files; found $($actualRawFiles.Count)")
}

foreach ($file in @(
    'product-master-database.json',
    'product-master-data-source.json',
    'product-master-rows.json'
)) {
    if (-not (Test-Path -LiteralPath (Join-Path $rawDatabasePath $file))) {
        $failures.Add("Missing raw database fetch: $file")
    }
}

$rawDatabaseResponse = Get-Content -Raw -LiteralPath (Join-Path $rawDatabasePath 'product-master-database.json') | ConvertFrom-Json
$rawDataSourceResponse = Get-Content -Raw -LiteralPath (Join-Path $rawDatabasePath 'product-master-data-source.json') | ConvertFrom-Json
$rawRowsResponse = Get-Content -Raw -LiteralPath (Join-Path $rawDatabasePath 'product-master-rows.json') | ConvertFrom-Json

$schema = Get-Content -Raw -LiteralPath (Join-Path $root 'data/product-master/schema.json') | ConvertFrom-Json
$schemaProperties = @($schema.schema.PSObject.Properties)
if ($schemaProperties.Count -ne 44) {
    $failures.Add("Expected 44 Product Master properties; found $($schemaProperties.Count)")
}

$rawStateMatch = [regex]::Match(
    $rawDataSourceResponse.text,
    '<data-source-state>\s*(.*?)\s*</data-source-state>',
    [System.Text.RegularExpressions.RegexOptions]::Singleline
)
if (-not $rawStateMatch.Success) {
    $failures.Add('Could not read schema from the raw Product Master data-source response')
} else {
    $rawState = $rawStateMatch.Groups[1].Value | ConvertFrom-Json
    $rawSchemaJson = $rawState.schema | ConvertTo-Json -Depth 30 -Compress
    $normalizedSchemaJson = $schema.schema | ConvertTo-Json -Depth 30 -Compress
    if ($rawSchemaJson -ne $normalizedSchemaJson) {
        $failures.Add('schema.json does not exactly match the raw Product Master schema')
    }
}

$views = Get-Content -Raw -LiteralPath (Join-Path $root 'data/product-master/views.json') | ConvertFrom-Json
if ($views.Count -ne 12) {
    $failures.Add("Expected 12 Product Master views; found $($views.Count)")
}
$rawViewMatches = [regex]::Matches(
    $rawDatabaseResponse.text,
    '<view url="\{\{(view://[^}]+)\}\}">\s*(.*?)\s*</view>',
    [System.Text.RegularExpressions.RegexOptions]::Singleline
)
if ($rawViewMatches.Count -ne 12) {
    $failures.Add("Expected 12 views in the raw Product Master response; found $($rawViewMatches.Count)")
}

$rows = Get-Content -Raw -LiteralPath (Join-Path $root 'data/product-master/rows.json') | ConvertFrom-Json
if ($rows.Count -ne 38) {
    $failures.Add("Expected 38 Product Master rows; found $($rows.Count)")
}
$rawRows = $rawRowsResponse.results
if ($rawRows.Count -ne 38) {
    $failures.Add("Expected 38 rows in the raw Product Master query; found $($rawRows.Count)")
}
$rawRowsJson = $rawRows | ConvertTo-Json -Depth 30 -Compress
$normalizedRowsJson = $rows | ConvertTo-Json -Depth 30 -Compress
if ($rawRowsJson -ne $normalizedRowsJson) {
    $failures.Add('rows.json does not exactly match the raw Product Master query result')
}

function Normalize-ProductName {
    param([string]$Value)
    return [regex]::Replace($Value.ToLowerInvariant(), '[^a-z0-9]+', '')
}

if ($rows.Count -gt 0) {
    $rowProperties = @($rows[0].PSObject.Properties.Name)
    foreach ($property in $schemaProperties.Name) {
        if ($property -notin $rowProperties) {
            $failures.Add("rows.json is missing database property: $property")
        }
    }

    $scopeChecklist = Get-Content -Raw -LiteralPath (Join-Path $root 'data/product-master/signed-scope-checklist.json') | ConvertFrom-Json
    $rowNames = @($rows | ForEach-Object { Normalize-ProductName $_.'Product / Model Name' })
    foreach ($expected in $scopeChecklist.signed_products_expected) {
        $normalizedExpected = Normalize-ProductName $expected
        $match = @($rowNames | Where-Object {
            $_.Contains($normalizedExpected) -or $normalizedExpected.Contains($_)
        })
        if ($match.Count -eq 0) {
            $failures.Add("Missing signed product or variant: $expected")
        }
    }

    $supportNames = @(
        $rows |
            Where-Object { $_.'Signed Scope Treatment' -eq 'Covered Support Item' } |
            ForEach-Object { Normalize-ProductName $_.'Product / Model Name' }
    )
    foreach ($expected in $scopeChecklist.support_items_expected) {
        $normalizedExpected = Normalize-ProductName $expected
        $match = @($supportNames | Where-Object {
            $_.Contains($normalizedExpected) -or $normalizedExpected.Contains($_)
        })
        if ($match.Count -eq 0) {
            $failures.Add("Missing Covered Support Item treatment: $expected")
        }
    }
}

$csvHeader = Get-Content -LiteralPath (Join-Path $root 'data/product-master/rows.csv') -TotalCount 1
$csvColumnCount = ([regex]::Matches($csvHeader, '","')).Count + 1
if ($csvColumnCount -ne 45) {
    $failures.Add("Expected 45 CSV columns (row URL + 44 database); found $csvColumnCount")
}

$pendingMarkers = Get-ChildItem -LiteralPath $rawPagesPath -File -Filter '*.json' |
    Select-String -SimpleMatch 'pending-refresh'
if ($pendingMarkers) {
    $failures.Add('Raw page fetches still contain pending-refresh markers')
}

if ($failures.Count -gt 0) {
    Write-Host 'Notion export validation failed:'
    $failures | ForEach-Object { Write-Host "- $_" }
    exit 1
}

Write-Host 'Notion export validation passed.'
