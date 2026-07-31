$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure {
    param([string]$Message)
    $failures.Add($Message)
}

function Resolve-RepoPath {
    param([string]$RelativePath)
    return (Join-Path $root ($RelativePath -replace '/', '\'))
}

function Read-JsonArray {
    param([string]$Path)
    $parsed = Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json
    $items = @()
    foreach ($item in $parsed) { $items += $item }
    return $items
}

$guidePath = Resolve-RepoPath 'docs/00-governance/notion-system-reconstruction-guide.md'
$manifestPath = Resolve-RepoPath 'data/notion-export/notion-reconstruction-manifest.json'
$sourceMapPath = Resolve-RepoPath 'notion-source-map.json'
$rowsPath = Resolve-RepoPath 'data/product-master/rows.json'
$csvPath = Resolve-RepoPath 'data/product-master/rows.csv'
$schemaPath = Resolve-RepoPath 'data/product-master/schema.json'
$viewsPath = Resolve-RepoPath 'data/product-master/views.json'
$taxonomyPath = Resolve-RepoPath 'data/product-master/taxonomy.json'

foreach ($path in @($guidePath, $manifestPath, $sourceMapPath, $rowsPath, $csvPath, $schemaPath, $viewsPath, $taxonomyPath)) {
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { Add-Failure "Missing reconstruction input: $path" }
}

if ($failures.Count -eq 0) {
    try { $manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json } catch { Add-Failure 'Reconstruction manifest is not valid JSON.' }
    try { $sourceMap = Get-Content -Raw -LiteralPath $sourceMapPath | ConvertFrom-Json } catch { Add-Failure 'Notion source map is not valid JSON.' }
}

if ($failures.Count -eq 0) {
    if ([string]$manifest.guide_path -ne 'docs/00-governance/notion-system-reconstruction-guide.md') { Add-Failure 'Manifest does not point to the canonical reconstruction guide.' }
    if ([string]$manifest.validator_path -ne 'scripts/validate_notion_reconstruction.ps1') { Add-Failure 'Manifest does not point to this validator.' }
    $corePages = @($sourceMap.core_pages)
    $rawPages = @($sourceMap.raw_input_pages)
    if ($corePages.Count -ne [int]$manifest.coverage.core_surface_count) { Add-Failure "Core surface count mismatch: expected $($manifest.coverage.core_surface_count), found $($corePages.Count)." }
    if ($rawPages.Count -ne [int]$manifest.coverage.immutable_raw_source_count) { Add-Failure "Immutable raw-source count mismatch: expected $($manifest.coverage.immutable_raw_source_count), found $($rawPages.Count)." }
    foreach ($page in @($corePages + $rawPages)) {
        $pagePath = Resolve-RepoPath ([string]$page.raw_fetch_path)
        if (-not (Test-Path -LiteralPath $pagePath -PathType Leaf)) { Add-Failure "Mapped Notion evidence is missing: $($page.raw_fetch_path)" }
    }
    foreach ($page in $corePages) {
        if ([string]$page.title -notlike '*Services Agreement*' -and [string]$page.raw_fetch_path -notlike 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/*') { Add-Failure "Core surface is not mapped to final post-cutover evidence: $($page.title)" }
    }
}

if ($failures.Count -eq 0) {
    $rows = Read-JsonArray -Path $rowsPath
    $csvRows = @(Import-Csv -LiteralPath $csvPath -Encoding UTF8)
    $schema = Get-Content -Raw -LiteralPath $schemaPath | ConvertFrom-Json
    $views = Read-JsonArray -Path $viewsPath
    if ($rows.Count -ne [int]$manifest.coverage.product_master_row_count) { Add-Failure "Product Master JSON row count mismatch: $($rows.Count)." }
    if ($csvRows.Count -ne [int]$manifest.coverage.product_master_row_count) { Add-Failure "Product Master CSV row count mismatch: $($csvRows.Count)." }
    if (@($schema.schema.PSObject.Properties).Count -ne [int]$manifest.coverage.product_master_active_property_count) { Add-Failure 'Product Master active property count mismatch.' }
    if ($views.Count -ne [int]$manifest.coverage.product_master_view_count) { Add-Failure 'Product Master view count mismatch.' }
    $families = @{}
    foreach ($row in $rows) {
        $family = [string]$row.'Product Family'
        if (-not $families.ContainsKey($family)) { $families[$family] = 0 }
        $families[$family]++
    }
    foreach ($familyProperty in $manifest.coverage.product_family_counts.PSObject.Properties) {
        if (-not $families.ContainsKey($familyProperty.Name) -or $families[$familyProperty.Name] -ne [int]$familyProperty.Value) { Add-Failure "Product Family distribution mismatch for $($familyProperty.Name)." }
    }
    if ($families.Count -ne 5) { Add-Failure "Expected five active Product Families; found $($families.Count)." }
    $ltc = @($rows | Where-Object { [string]$_.'Product / Model Name' -match 'LTC-PRO' -or [string]$_.'Model / Variant' -match 'LTC-PRO' })
    if ($ltc.Count -eq 0 -or [string]$ltc[0].'Product Family' -ne [string]$manifest.coverage.ltc_pro_family) { Add-Failure 'LTC-PRO is not mapped to the canonical PF-05 family.' }
}

if ($failures.Count -eq 0) {
    foreach ($entry in $manifest.protected_hashes_sha256.PSObject.Properties) {
        $protectedPath = Resolve-RepoPath $entry.Name
        if (-not (Test-Path -LiteralPath $protectedPath -PathType Leaf)) { Add-Failure "Protected file is missing: $($entry.Name)"; continue }
        $actualHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $protectedPath).Hash.ToUpperInvariant()
        if ($actualHash -ne ([string]$entry.Value).ToUpperInvariant()) { Add-Failure "Protected file hash changed: $($entry.Name)" }
    }
    $agreement = Resolve-RepoPath 'docs/00-governance/services-agreement-final-signature-copy.md'
    $inputIndex = Resolve-RepoPath 'docs/04-source-archive/input-files-index.md'
    foreach ($protectedText in @($agreement, $inputIndex)) {
        if (-not (Test-Path -LiteralPath $protectedText)) { Add-Failure "Protected input is missing: $protectedText" }
    }
}

$staleMarkers = @(
    'legacy-field cleanup pending approval checkpoint',
    'final legacy-field cleanup held for review'
)
foreach ($activePath in @((Resolve-RepoPath 'README.md'), $sourceMapPath)) {
    if (Test-Path -LiteralPath $activePath) {
        $activeText = Get-Content -Raw -LiteralPath $activePath
        foreach ($marker in $staleMarkers) { if ($activeText -like "*$marker*") { Add-Failure "Stale post-cutover status remains in ${activePath}: $marker" } }
    }
}

if ($failures.Count -gt 0) {
    Write-Host 'Notion reconstruction validation failed:'
    $failures | ForEach-Object { Write-Host "- $_" }
    exit 1
}

Write-Host 'Notion reconstruction validation passed: guide and manifest present, 11 core surfaces, 19 immutable sources, 38 rows, 44 properties, 12 views, canonical family distribution, LTC-PRO mapping, and protected hashes verified.'
