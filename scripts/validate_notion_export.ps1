$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure {
    param([string]$Message)
    $failures.Add($Message)
}

function Read-NotionEnvelope {
    param([string]$Path)
    try {
        $json = Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json
    } catch {
        Add-Failure "Invalid Notion JSON: $Path"
        return $null
    }
    if ($json.metadata -and $json.url -and $json.text) { return $json }
    if ($json.content -and $json.content[0].text) {
        try {
            $inner = $json.content[0].text | ConvertFrom-Json
            if ($inner.metadata -and $inner.url -and $inner.text) { return $inner }
        } catch {
            Add-Failure "Invalid wrapped Notion response: $Path"
            return $null
        }
    }
    if ($json.response.content -and $json.response.content[0].text) {
        try {
            $inner = $json.response.content[0].text | ConvertFrom-Json
            if ($inner.metadata -and $inner.url -and $inner.text) { return $inner }
        } catch {
            Add-Failure "Invalid final Notion response wrapper: $Path"
            return $null
        }
    }
    Add-Failure "Incomplete Notion fetch envelope: $Path"
    return $null
}

$sourceMapPath = Join-Path $root 'notion-source-map.json'
if (-not (Test-Path -LiteralPath $sourceMapPath)) {
    Write-Host 'Notion export validation failed:'
    Write-Host '- Missing notion-source-map.json'
    exit 1
}

$sourceMap = Get-Content -Raw -LiteralPath $sourceMapPath | ConvertFrom-Json
$corePages = @($sourceMap.core_pages)
$rawPages = @($sourceMap.raw_input_pages)
if ($corePages.Count -ne 11) {
    Add-Failure "Expected 11 mapped core surfaces including taxonomy governance; found $($corePages.Count)."
}
if ($rawPages.Count -ne 19) {
    Add-Failure "Expected 19 mapped immutable raw source pages; found $($rawPages.Count)."
}

$mappedPages = $corePages + $rawPages
$duplicateIds = @($mappedPages | Group-Object id | Where-Object Count -gt 1)
foreach ($duplicate in $duplicateIds) {
    Add-Failure "Duplicate Notion page ID in source map: $($duplicate.Name)"
}

foreach ($page in $mappedPages) {
    $relativePath = [string]$page.raw_fetch_path
    $fullPath = Join-Path $root $relativePath
    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        Add-Failure "Missing mapped Notion fetch: $relativePath"
        continue
    }
    $envelope = Read-NotionEnvelope -Path $fullPath
    if ($envelope -and $envelope.url -notlike "*$($page.id)*") {
        Add-Failure "Mapped Notion fetch does not match ID $($page.id): $relativePath"
    }
}

$correctNestedIds = @(
    '1f83dd29567d82f29ae681eedafdb20e',
    '5663dd29567d82f59edf01f0a2845511',
    'f533dd29567d8291a199012d56279849',
    'ac83dd29567d82d0a96e81514259839b',
    '54b3dd29567d82fdbf568104ad4e888c'
)
foreach ($id in $correctNestedIds) {
    if ($rawPages.id -notcontains $id) {
        Add-Failure "Nested source page is absent from source map: $id"
    }
}

$rowsPath = Join-Path $root 'data/product-master/rows.json'
$csvPath = Join-Path $root 'data/product-master/rows.csv'
$schemaPath = Join-Path $root 'data/product-master/schema.json'
$viewsPath = Join-Path $root 'data/product-master/views.json'
foreach ($path in @($rowsPath, $csvPath, $schemaPath, $viewsPath)) {
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { Add-Failure "Missing Product Master export: $path" }
}

if ($failures.Count -eq 0) {
    $rowsRaw = Get-Content -Raw -LiteralPath $rowsPath | ConvertFrom-Json
    $rows = @()
    foreach ($row in $rowsRaw) { $rows += $row }
    if ($rows.Count -ne 38) { Add-Failure "Expected 38 Product Master rows; found $($rows.Count)." }

    $schema = Get-Content -Raw -LiteralPath $schemaPath | ConvertFrom-Json
    $schemaProperties = @($schema.schema.PSObject.Properties)
    if ($schemaProperties.Count -ne 44) { Add-Failure "Expected 44 Product Master properties; found $($schemaProperties.Count)." }

    $viewsRaw = Get-Content -Raw -LiteralPath $viewsPath | ConvertFrom-Json
    $views = @()
    foreach ($view in $viewsRaw) { $views += $view }
    if ($views.Count -ne 12) { Add-Failure "Expected 12 Product Master views; found $($views.Count)." }

    $csvRows = @(Import-Csv -LiteralPath $csvPath -Encoding UTF8)
    if ($csvRows.Count -ne 38) { Add-Failure "Expected 38 Product Master CSV rows; found $($csvRows.Count)." }
    if (@($csvRows[0].PSObject.Properties).Count -ne 45) { Add-Failure "Expected 45 Product Master CSV columns including URL." }
}

$migrationRoot = Join-Path $root 'data/notion-export/taxonomy-migration/2026-07-30'
$preRoot = Join-Path $migrationRoot 'pre-migration'
$postRoot = Join-Path $migrationRoot 'post-migration'
$cutoverRoot = Join-Path $migrationRoot 'post-cutover'
$integrityPath = Join-Path $migrationRoot 'integrity-manifest.csv'
foreach ($path in @($preRoot, $postRoot, $cutoverRoot, $integrityPath)) {
    if (-not (Test-Path -LiteralPath $path)) { Add-Failure "Missing taxonomy migration evidence: $path" }
}

if (Test-Path -LiteralPath $integrityPath) {
    $integrity = @(Import-Csv -LiteralPath $integrityPath)
    if ($integrity.Count -ne 20) { Add-Failure "Expected 20 immutable integrity records; found $($integrity.Count)." }
    foreach ($record in $integrity) {
        if ($record.unchanged -ne 'yes' -or $record.pre_sha256 -ne $record.post_sha256) {
            Add-Failure "Immutable evidence changed: $($record.file_name)"
        }
    }
    if (@($integrity | Where-Object evidence_type -eq 'signed-agreement').Count -ne 1) {
        Add-Failure 'Signed Agreement integrity record is missing or duplicated.'
    }
    if (@($integrity | Where-Object evidence_type -eq 'immutable-raw-source').Count -ne 19) {
        Add-Failure 'Expected 19 immutable raw-source integrity records.'
    }
}

foreach ($requiredPostFile in @(
    'taxonomy-governance.json',
    'product-master-database.json',
    'product-master-data-source.json',
    'annexure-a.json',
    'internal-copy-annexure-a.json'
)) {
    if (-not (Test-Path -LiteralPath (Join-Path $postRoot $requiredPostFile))) {
        Add-Failure "Missing post-migration Notion snapshot: $requiredPostFile"
    }
}

foreach ($requiredCutoverFile in @(
    'taxonomy-governance.json',
    'product-master-database.json',
    'product-master-data-source.json',
    'live-row-verification.json',
    'puretronics-main-page.json',
    'input-files-index.json',
    'master-document.json',
    'product-intelligence-hub.json',
    'master-user-guide.json',
    'annexure-a.json',
    'internal-copy-annexure-a.json',
    'annexure-b.json'
)) {
    if (-not (Test-Path -LiteralPath (Join-Path $cutoverRoot $requiredCutoverFile))) {
        Add-Failure "Missing final post-cutover Notion snapshot: $requiredCutoverFile"
    }
}

$finalDataSourcePath = Join-Path $cutoverRoot 'product-master-data-source.json'
if (Test-Path -LiteralPath $finalDataSourcePath) {
    $outer = Get-Content -Raw -LiteralPath $finalDataSourcePath | ConvertFrom-Json
    try {
        $inner = $outer.response.content[0].text | ConvertFrom-Json
        $stateMatch = [regex]::Match($inner.text, '<data-source-state>\s*(\{.*?\})\s*</data-source-state>', 'Singleline')
        if (-not $stateMatch.Success) {
            Add-Failure 'Final Product Master data-source state is not parseable.'
        } else {
            $state = $stateMatch.Groups[1].Value | ConvertFrom-Json
            if (@($state.schema.PSObject.Properties).Count -ne 44) { Add-Failure 'Final live Product Master must contain 44 active properties.' }
            if ($null -ne $state.schema.'Legacy Product Family') { Add-Failure 'Final live Product Master still contains Legacy Product Family.' }
            $familyOptions = @($state.schema.'Product Family'.options | ForEach-Object name)
            $expectedFamilies = @(
                'Inline Measurement & Dimensional Control',
                'Inline Spark Testing & Insulation Fault Detection',
                'Cable Testing & Validation',
                'Process Equipment & Line Auxiliaries',
                'Tension / Braking / Line Control'
            )
            if (($familyOptions -join '|') -ne ($expectedFamilies -join '|')) { Add-Failure 'Final live Product Family options are not canonical or are out of order.' }
        }
    } catch {
        Add-Failure 'Final Product Master data-source snapshot is invalid.'
    }
}

if ($failures.Count -gt 0) {
    Write-Host 'Notion export validation failed:'
    $failures | ForEach-Object { Write-Host "- $_" }
    exit 1
}

Write-Host 'Notion export validation passed: 11 core surfaces, 19 immutable source pages, 38 Product Master rows, 44 final active properties, 12 views, legacy field removed, and 20 unchanged integrity records.'
