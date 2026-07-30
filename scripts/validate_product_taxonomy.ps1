$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure {
    param([string]$Message)
    $failures.Add($Message)
}

function Expand-JsonArray {
    param([string]$Path)
    $raw = Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json
    $result = @()
    foreach ($item in $raw) { $result += $item }
    return $result
}

function Expand-JsonStringArray {
    param([string]$Json)
    $raw = $Json | ConvertFrom-Json
    $result = @()
    foreach ($item in $raw) { $result += [string]$item }
    return $result
}

$canonicalFamilies = [ordered]@{
    'Inline Measurement & Dimensional Control' = 9
    'Inline Spark Testing & Insulation Fault Detection' = 7
    'Cable Testing & Validation' = 3
    'Process Equipment & Line Auxiliaries' = 6
    'Tension / Braking / Line Control' = 13
}
$canonicalSlugs = @(
    'inline-measurement-dimensional-control',
    'inline-spark-testing-insulation-fault-detection',
    'cable-testing-validation',
    'process-equipment-line-auxiliaries',
    'tension-braking-line-control'
)
$canonicalThemes = @(
    'Dimensional Measurement & Control',
    'Spark Testing & Fault Intelligence',
    'Electrical/HV Validation',
    'Fire Resistance & Circuit Integrity',
    'Wire Preheating & Adhesion',
    'Static Powder Application',
    'Conductor Joining & Repair',
    'Tension Measurement & Control',
    'Braking & Unwind/Rewind Control',
    'Data & Reporting',
    'Calibration & Support'
)

$rowsPath = Join-Path $root 'data/product-master/rows.json'
$schemaPath = Join-Path $root 'data/product-master/schema.json'
$viewsPath = Join-Path $root 'data/product-master/views.json'
$taxonomyPath = Join-Path $root 'data/product-master/taxonomy.json'
$migrationManifestPath = Join-Path $root 'data/product-master/taxonomy-migration-manifest.csv'
$assetPath = Join-Path $root 'data/funnel-assets/funnel-asset-master.csv'
$sourceMapPath = Join-Path $root 'notion-source-map.json'
$liveVerificationPath = Join-Path $root 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/live-row-verification.json'
$finalDataSourcePath = Join-Path $root 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/product-master-data-source.json'
$finalGovernancePath = Join-Path $root 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/taxonomy-governance.json'
$integrityPath = Join-Path $root 'data/notion-export/taxonomy-migration/2026-07-30/integrity-manifest.csv'

foreach ($path in @($rowsPath, $schemaPath, $viewsPath, $taxonomyPath, $migrationManifestPath, $assetPath, $sourceMapPath, $liveVerificationPath, $finalDataSourcePath, $finalGovernancePath, $integrityPath)) {
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { Add-Failure "Missing taxonomy validation input: $path" }
}
if ($failures.Count -gt 0) {
    Write-Host 'Product taxonomy validation failed:'
    $failures | ForEach-Object { Write-Host "- $_" }
    exit 1
}

$rows = Expand-JsonArray -Path $rowsPath
if ($rows.Count -ne 38) { Add-Failure "Expected 38 Product Master rows; found $($rows.Count)." }

foreach ($row in $rows) {
    $family = [string]$row.'Product Family'
    if (-not $family -or $family -notin $canonicalFamilies.Keys) {
        Add-Failure "Unmapped or uncontrolled Product Family on $($row.'Product / Model Name'): $family"
    }
}
foreach ($family in $canonicalFamilies.Keys) {
    $count = @($rows | Where-Object { $_.'Product Family' -eq $family }).Count
    if ($count -ne $canonicalFamilies[$family]) {
        Add-Failure "Product Family count mismatch for '$family': expected $($canonicalFamilies[$family]), found $count."
    }
}

$fire = @($rows | Where-Object { $_.'Product / Model Name' -eq 'Fire Resistance Cable Testing System' })
if ($fire.Count -ne 1 -or $fire[0].'Product Family' -ne 'Cable Testing & Validation') {
    Add-Failure 'Fire Resistance Cable Testing System must map exactly once to PF-03.'
} else {
    $fireThemes = @(Expand-JsonStringArray -Json $fire[0].'Solution Theme')
    if ('Fire Resistance & Circuit Integrity' -notin $fireThemes) { Add-Failure 'Fire Resistance theme is missing from the Fire Resistance Cable Testing System.' }
    if ('Electrical/HV Validation' -in $fireThemes) { Add-Failure 'Fire Resistance Cable Testing System incorrectly carries Electrical/HV Validation.' }
}

$ltc = @($rows | Where-Object { $_.'Product / Model Name' -eq 'LTC-PRO Web Tension Controller' })
if ($ltc.Count -ne 1 -or $ltc[0].'Product Family' -ne 'Tension / Braking / Line Control') {
    Add-Failure 'LTC-PRO must map exactly once to PF-05.'
}

foreach ($row in $rows) {
    $themes = @(Expand-JsonStringArray -Json $row.'Solution Theme')
    foreach ($theme in $themes) {
        if ($theme -notin $canonicalThemes) { Add-Failure "Uncontrolled Solution Theme on $($row.'Product / Model Name'): $theme" }
    }
}

$schema = Get-Content -Raw -LiteralPath $schemaPath | ConvertFrom-Json
$schemaFamilies = @($schema.schema.'Product Family'.options | ForEach-Object name)
if (($schemaFamilies -join '|') -ne ($canonicalFamilies.Keys -join '|')) {
    Add-Failure 'Product Master schema does not contain the five canonical Product Family options in order.'
}
$schemaThemes = @($schema.schema.'Solution Theme'.options | ForEach-Object name)
if (($schemaThemes -join '|') -ne ($canonicalThemes -join '|')) {
    Add-Failure 'Product Master schema Solution Theme vocabulary is not canonical or is out of order.'
}
foreach ($legacy in @('Fault & Safety Testing','Process Enhancement','Tension / Braking / Automation','Diameter / Ovality Control','Spark Fault Intelligence','Fire Compliance')) {
    if ($schema.sqlite_table -like "*$legacy*") { Add-Failure "Generated SQLite schema contains deprecated active value: $legacy" }
}

$views = Expand-JsonArray -Path $viewsPath
if ($views.Count -ne 12) { Add-Failure "Expected 12 Product Master views; found $($views.Count)." }
$viewJson = $views | ConvertTo-Json -Depth 20 -Compress
foreach ($legacy in @('Fault & Safety Testing','Process Enhancement','Tension / Braking / Automation')) {
    if ($viewJson -like "*$legacy*") { Add-Failure "A Product Master view contains stale taxonomy logic: $legacy" }
}
$familyView = @($views | Where-Object name -eq '04 Product Family Navigator')
if ($familyView.Count -ne 1 -or $familyView[0].groupBy.property -ne 'Product Family') {
    Add-Failure '04 Product Family Navigator is not grouped by canonical Product Family.'
}
$proposalView = @($views | Where-Object name -eq '08 Proposal & Funnel Builder')
if ($proposalView.Count -ne 1 -or $proposalView[0].displayProperties -notcontains 'Product Family') {
    Add-Failure '08 Proposal & Funnel Builder does not display Product Family.'
}

$assets = @(Import-Csv -LiteralPath $assetPath -Encoding UTF8)
$familyExperiences = @($assets | Where-Object asset_type -eq 'product-family-experience')
if ($familyExperiences.Count -ne 5) { Add-Failure "Expected five Product Family experiences; found $($familyExperiences.Count)." }
foreach ($slug in $canonicalSlugs) {
    $match = @($familyExperiences | Where-Object { $_.product_family -eq $slug -and $_.solution_block -eq $slug })
    if ($match.Count -ne 1) { Add-Failure "Missing or duplicated canonical family experience: $slug" }
}
$fireModule = @($assets | Where-Object {
    $_.asset_id -eq 'FA-0078' -and
    $_.parent_asset_id -eq 'FA-0077' -and
    $_.asset_type -eq 'solution-theme-module' -and
    $_.product_family -eq 'cable-testing-validation'
})
if ($fireModule.Count -ne 1) { Add-Failure 'FA-0078 is not a PF-03 child theme/module.' }
if (-not ($assets | Where-Object { $_.asset_id -eq 'FA-0211' -and $_.product_family -eq 'tension-braking-line-control' })) {
    Add-Failure 'FA-0211 PF-05 parent experience is missing.'
}

$migrationRows = @(Import-Csv -LiteralPath $migrationManifestPath)
if ($migrationRows.Count -ne 38 -or @($migrationRows | Where-Object migration_result -ne 'migrated').Count -gt 0) {
    Add-Failure 'Row-level taxonomy migration manifest is incomplete.'
}

$sourceMap = Get-Content -Raw -LiteralPath $sourceMapPath | ConvertFrom-Json
if (@($sourceMap.raw_input_pages).Count -ne 19) { Add-Failure 'Source map must contain 19 raw source pages.' }
$requiredNestedIds = @(
    '1f83dd29567d82f29ae681eedafdb20e',
    '5663dd29567d82f59edf01f0a2845511',
    'f533dd29567d8291a199012d56279849',
    'ac83dd29567d82d0a96e81514259839b',
    '54b3dd29567d82fdbf568104ad4e888c'
)
foreach ($id in $requiredNestedIds) {
    if ($sourceMap.raw_input_pages.id -notcontains $id) { Add-Failure "Correct nested source ID is absent: $id" }
}

$live = Get-Content -Raw -LiteralPath $liveVerificationPath | ConvertFrom-Json
if ($live.row_count -ne 38) { Add-Failure "Live individual-fetch verification contains $($live.row_count) rows, expected 38." }
if ($live.approval_state -ne 'approved') { Add-Failure 'Final live verification is not marked approved.' }
if ($live.taxonomy_owner -ne 'Vaibhav Kuvadia + Codex' -or $live.operational_steward -ne 'Vaibhav Kuvadia + Codex') {
    Add-Failure 'Final live verification does not record the approved owner and steward.'
}
if ($live.legacy_product_family_removed -ne $true) { Add-Failure 'Final live verification does not confirm legacy-field removal.' }
if ($live.standards_treatment -notlike '*pending-puretronics-validation*external compliance claims prohibited*') {
    Add-Failure 'Final live verification does not enforce the approved standards treatment.'
}
$liveFamilyExpected = [ordered]@{
    'Inline Measurement & Dimensional Control' = 9
    'Inline Spark Testing & Insulation Fault Detection' = 7
    'Cable Testing & Validation' = 3
    'Process Equipment & Line Auxiliaries' = 6
    'Tension / Braking / Line Control' = 13
}
foreach ($family in $liveFamilyExpected.Keys) {
    $count = @($live.rows | Where-Object product_family -eq $family).Count
    if ($count -ne $liveFamilyExpected[$family]) { Add-Failure "Live Product Family count mismatch for '$family': expected $($liveFamilyExpected[$family]), found $count." }
}
$liveFire = @($live.rows | Where-Object name -eq 'Fire Resistance Cable Testing System')
if ($liveFire.Count -ne 1 -or 'Electrical/HV Validation' -in @($liveFire[0].solution_themes)) {
    Add-Failure 'Live Fire Resistance row has an invalid family/theme mapping.'
}
$liveLtc = @($live.rows | Where-Object name -eq 'LTC-PRO Web Tension Controller')
if ($liveLtc.Count -ne 1 -or $liveLtc[0].product_family -ne 'Tension / Braking / Line Control') {
    Add-Failure 'Live LTC-PRO row is absent from the canonical PF-05 label.'
}

$finalDataSourceJson = Get-Content -Raw -LiteralPath $finalDataSourcePath
if ($finalDataSourceJson -notlike '*Tension / Braking / Line Control*') {
    Add-Failure 'Final live data-source snapshot lacks the approved PF-05 label.'
}
if ($finalDataSourceJson -like '*"name":"Legacy Product Family"*' -or $finalDataSourceJson -like '*\"name\":\"Legacy Product Family\"*') {
    Add-Failure 'Final live data-source snapshot still contains the Legacy Product Family property.'
}
foreach ($oldPf05 in @('Tension Braking & Line Control','Tension, Braking & Line Control')) {
    if ($finalDataSourceJson -like "*$oldPf05*") { Add-Failure "Final live data-source snapshot contains an uncontrolled PF-05 synonym: $oldPf05" }
}

$finalGovernanceJson = Get-Content -Raw -LiteralPath $finalGovernancePath
foreach ($requiredGovernanceText in @(
    'Vaibhav Kuvadia + Codex',
    'Approval state',
    'Approved',
    'pending-puretronics-validation',
    'no external compliance claim',
    'Legacy Product Family',
    'removed'
)) {
    if ($finalGovernanceJson -notlike "*$requiredGovernanceText*") { Add-Failure "Final governance snapshot lacks: $requiredGovernanceText" }
}

$integrity = @(Import-Csv -LiteralPath $integrityPath)
if ($integrity.Count -ne 20 -or @($integrity | Where-Object unchanged -ne 'yes').Count -gt 0) {
    Add-Failure 'Signed Agreement/raw-source integrity manifest is incomplete or contains a changed record.'
}

$productPages = @(Get-ChildItem -LiteralPath (Join-Path $root 'docs/03-product-intelligence/products') -Filter '*.md' -File)
if ($productPages.Count -ne 38) { Add-Failure "Expected 38 generated product pages; found $($productPages.Count)." }
foreach ($page in $productPages) {
    $content = Get-Content -Raw -LiteralPath $page.FullName
    if ($content -notmatch '\| Product Family \| (Inline Measurement & Dimensional Control|Inline Spark Testing & Insulation Fault Detection|Cable Testing & Validation|Process Equipment & Line Auxiliaries|Tension / Braking / Line Control) \|') {
        Add-Failure "Generated product page has a noncanonical Product Family: $($page.Name)"
    }
}

$generator = Get-Content -Raw -LiteralPath (Join-Path $root 'scripts/generate_workspace.ps1')
foreach ($legacy in @('Fault & Safety Testing','Process Enhancement','Tension / Braking / Automation','Five Solution Blocks','five-solution-blocks.md','Tension Braking & Line Control','Tension, Braking & Line Control')) {
    if ($generator -like "*$legacy*") { Add-Failure "Workspace generator can regenerate deprecated taxonomy: $legacy" }
}

$deprecatedPatterns = @(
    'Fault & Safety Testing',
    'Process Enhancement',
    'Tension / Braking / Automation',
    'HV & Cable Validation',
    'Line Stability, Adhesion & Tension Control',
    'Five Solution Blocks',
    'five-solution-blocks.md',
    'fault-safety-testing',
    'process-enhancement',
    'tension-braking-automation',
    'Tension Braking & Line Control',
    'Tension, Braking & Line Control',
    'solution-block-experience',
    'section-solution-block-overview',
    'relevant-solution-block',
    'format-solution-block'
)
$allowPathPattern = 'data\\notion-export\\|docs\\04-source-archive\\|docs\\00-governance\\services-agreement-final-signature-copy\.md$|docs\\00-governance\\product-taxonomy-governance\.md$|data\\product-master\\taxonomy-migration-manifest\.csv$|data\\product-master\\taxonomy\.json$|project-ops\\taxonomy-migration-preview\.md$|project-ops\\taxonomy-occurrence-report\.md$|scripts\\apply_product_taxonomy_migration\.ps1$|scripts\\validate_product_taxonomy\.ps1$'
$activeFiles = Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object {
    $_.Extension -in @('.md','.json','.csv','.ps1') -and
    $_.FullName -notmatch '\\.git\\' -and
    $_.FullName.Substring($root.Length).TrimStart('\') -notmatch $allowPathPattern
}
foreach ($file in $activeFiles) {
    $content = Get-Content -Raw -LiteralPath $file.FullName
    foreach ($legacy in $deprecatedPatterns) {
        if ($content -like "*$legacy*") {
            Add-Failure "Deprecated taxonomy term '$legacy' found in active file: $($file.FullName.Substring($root.Length).TrimStart('\'))"
        }
    }
}

if ($failures.Count -gt 0) {
    Write-Host 'Product taxonomy validation failed:'
    $failures | ForEach-Object { Write-Host "- $_" }
    exit 1
}

Write-Host 'Product taxonomy validation passed: approved repository/live 9/7/3/6/13, 38/38 rows, canonical PF-05 label, legacy field removed, five family experiences, 12 views, 19 immutable sources, Signed Agreement unchanged.'
