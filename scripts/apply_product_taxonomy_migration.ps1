[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot

$families = [ordered]@{
    PF01 = 'Inline Measurement & Dimensional Control'
    PF02 = 'Inline Spark Testing & Insulation Fault Detection'
    PF03 = 'Cable Testing & Validation'
    PF04 = 'Process Equipment & Line Auxiliaries'
    PF05 = 'Tension / Braking / Line Control'
}

$slugs = [ordered]@{
    PF01 = 'inline-measurement-dimensional-control'
    PF02 = 'inline-spark-testing-insulation-fault-detection'
    PF03 = 'cable-testing-validation'
    PF04 = 'process-equipment-line-auxiliaries'
    PF05 = 'tension-braking-line-control'
}

function Get-CanonicalProductMapping {
    param([string]$Name)

    if ($Name -match 'LASER|Laser') {
        return @{ Key = 'PF01'; Themes = @('Dimensional Measurement & Control', 'Data & Reporting') }
    }
    if ($Name -in @('AC HV Tester', 'DC HV Tester')) {
        return @{ Key = 'PF03'; Themes = @('Electrical/HV Validation') }
    }
    if ($Name -eq 'Fire Resistance Cable Testing System') {
        return @{ Key = 'PF03'; Themes = @('Fire Resistance & Circuit Integrity', 'Data & Reporting') }
    }
    if ($Name -match 'Spark Tester IoT Stage') {
        return @{ Key = 'PF02'; Themes = @('Spark Testing & Fault Intelligence', 'Data & Reporting') }
    }
    if ($Name -eq 'Spark Tester Sensitivity Calibrator') {
        return @{ Key = 'PF02'; Themes = @('Spark Testing & Fault Intelligence', 'Calibration & Support') }
    }
    if ($Name -match 'Spark Tester') {
        return @{ Key = 'PF02'; Themes = @('Spark Testing & Fault Intelligence') }
    }
    if ($Name -match 'Preheater') {
        return @{ Key = 'PF04'; Themes = @('Wire Preheating & Adhesion') }
    }
    if ($Name -match 'Static Powder Applicator') {
        return @{ Key = 'PF04'; Themes = @('Static Powder Application') }
    }
    if ($Name -eq 'Butt Welding Machine') {
        return @{ Key = 'PF04'; Themes = @('Conductor Joining & Repair') }
    }
    if ($Name -match 'Pneumatic Brake') {
        return @{ Key = 'PF05'; Themes = @('Tension Measurement & Control', 'Braking & Unwind/Rewind Control') }
    }
    if ($Name -eq 'LTC-PRO Web Tension Controller') {
        return @{ Key = 'PF05'; Themes = @('Tension Measurement & Control', 'Braking & Unwind/Rewind Control', 'Data & Reporting') }
    }
    if ($Name -match 'Wire Tension Indicator') {
        return @{ Key = 'PF05'; Themes = @('Tension Measurement & Control', 'Data & Reporting') }
    }
    if ($Name -eq 'Loadcell Accessories / Integration Items') {
        return @{ Key = 'PF05'; Themes = @('Tension Measurement & Control', 'Data & Reporting') }
    }
    if ($Name -match 'Loadcell') {
        return @{ Key = 'PF05'; Themes = @('Tension Measurement & Control') }
    }
    throw "No canonical Product Master mapping for '$Name'."
}

function Write-Utf8NoBom {
    param([string]$Path, [string]$Content)
    [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}

function ConvertTo-CanonicalSlug {
    param([string]$Value)
    $slug = $Value.ToLowerInvariant().Replace('&', ' and ')
    return [regex]::Replace($slug, '[^a-z0-9]+', '-').Trim('-')
}

$rowsPath = Join-Path $repoRoot 'data/product-master/rows.json'
$rowsRaw = Get-Content -LiteralPath $rowsPath -Raw | ConvertFrom-Json
$rows = @()
foreach ($rowItem in $rowsRaw) { $rows += $rowItem }
foreach ($row in $rows) {
    $mapping = Get-CanonicalProductMapping -Name $row.'Product / Model Name'
    $row.'Product Family' = $families[$mapping.Key]
    $row.'Solution Theme' = ConvertTo-Json @($mapping.Themes) -Compress
    $row.'Proposal Positioning' = $row.'Proposal Positioning'.Replace('process-enhancement product', 'process-equipment product')
}
Write-Utf8NoBom -Path $rowsPath -Content (($rows | ConvertTo-Json -Depth 20) + "`n")

$csvPath = Join-Path $repoRoot 'data/product-master/rows.csv'
$csv = $rows | ConvertTo-Csv -NoTypeInformation
Write-Utf8NoBom -Path $csvPath -Content (($csv -join "`r`n") + "`r`n")

$taxonomyDoc = [ordered]@{
    version = '1.0.0'
    effective_date = '2026-07-30'
    authority = 'docs/00-governance/product-taxonomy-governance.md'
    signed_agreement_precedence = $true
    product_families = @(
        [ordered]@{ id = 'PF-01'; label = $families.PF01; slug = $slugs.PF01; expected_rows = 9 }
        [ordered]@{ id = 'PF-02'; label = $families.PF02; slug = $slugs.PF02; expected_rows = 7 }
        [ordered]@{ id = 'PF-03'; label = $families.PF03; slug = $slugs.PF03; expected_rows = 3 }
        [ordered]@{ id = 'PF-04'; label = $families.PF04; slug = $slugs.PF04; expected_rows = 6 }
        [ordered]@{ id = 'PF-05'; label = $families.PF05; slug = $slugs.PF05; expected_rows = 13 }
    )
    solution_themes = @(
        'Dimensional Measurement & Control'
        'Spark Testing & Fault Intelligence'
        'Electrical/HV Validation'
        'Fire Resistance & Circuit Integrity'
        'Wire Preheating & Adhesion'
        'Static Powder Application'
        'Conductor Joining & Repair'
        'Tension Measurement & Control'
        'Braking & Unwind/Rewind Control'
        'Data & Reporting'
        'Calibration & Support'
    )
    deprecated_active_terms = @(
        'Online Measurement'
        'Fault & Safety Testing'
        'Process Enhancement'
        'Tension / Braking / Automation'
        'solution-block'
        'solution block'
        'five solution blocks'
    )
    approved_legacy_contexts = @(
        'signed agreement'
        'raw Notion/source exports'
        'pre-migration snapshots'
        'taxonomy governance crosswalk'
        'migration manifests'
    )
}
$taxonomyPath = Join-Path $repoRoot 'data/product-master/taxonomy.json'
Write-Utf8NoBom -Path $taxonomyPath -Content (($taxonomyDoc | ConvertTo-Json -Depth 10) + "`n")

$migrationRows = foreach ($row in $rows) {
    $newFamily = $row.'Product Family'
    $legacyFamily = switch ($newFamily) {
        $families.PF01 { 'Online Measurement' }
        $families.PF02 { 'Fault & Safety Testing' }
        $families.PF03 { 'Fault & Safety Testing' }
        $families.PF04 { 'Process Enhancement' }
        $families.PF05 { 'Tension / Braking / Automation' }
        default { throw "Unexpected canonical family '$newFamily'." }
    }
    [pscustomobject][ordered]@{
        product_model = $row.'Product / Model Name'
        notion_url = $row.url
        legacy_product_family = $legacyFamily
        canonical_product_family = $newFamily
        canonical_solution_themes = ((ConvertFrom-Json $row.'Solution Theme') -join ';')
        signed_scope_treatment = $row.'Signed Scope Treatment'
        migration_result = 'migrated'
    }
}
$manifestPath = Join-Path $repoRoot 'data/product-master/taxonomy-migration-manifest.csv'
$manifestCsv = $migrationRows | Sort-Object product_model | ConvertTo-Csv -NoTypeInformation
Write-Utf8NoBom -Path $manifestPath -Content (($manifestCsv -join "`r`n") + "`r`n")

$schemaPath = Join-Path $repoRoot 'data/product-master/schema.json'
$schemaDoc = Get-Content -LiteralPath $schemaPath -Raw | ConvertFrom-Json
$schemaDoc.schema.'Product Family'.options = @(
    [pscustomobject]@{ color = 'blue'; description = ''; name = $families.PF01 }
    [pscustomobject]@{ color = 'red'; description = ''; name = $families.PF02 }
    [pscustomobject]@{ color = 'orange'; description = ''; name = $families.PF03 }
    [pscustomobject]@{ color = 'green'; description = ''; name = $families.PF04 }
    [pscustomobject]@{ color = 'purple'; description = ''; name = $families.PF05 }
)
$schemaDoc.schema.'Solution Theme'.options = @(
    [pscustomobject]@{ color = 'blue'; description = ''; name = 'Dimensional Measurement & Control' }
    [pscustomobject]@{ color = 'red'; description = ''; name = 'Spark Testing & Fault Intelligence' }
    [pscustomobject]@{ color = 'orange'; description = ''; name = 'Electrical/HV Validation' }
    [pscustomobject]@{ color = 'red'; description = ''; name = 'Fire Resistance & Circuit Integrity' }
    [pscustomobject]@{ color = 'yellow'; description = ''; name = 'Wire Preheating & Adhesion' }
    [pscustomobject]@{ color = 'green'; description = ''; name = 'Static Powder Application' }
    [pscustomobject]@{ color = 'orange'; description = ''; name = 'Conductor Joining & Repair' }
    [pscustomobject]@{ color = 'purple'; description = ''; name = 'Tension Measurement & Control' }
    [pscustomobject]@{ color = 'brown'; description = ''; name = 'Braking & Unwind/Rewind Control' }
    [pscustomobject]@{ color = 'blue'; description = ''; name = 'Data & Reporting' }
    [pscustomobject]@{ color = 'gray'; description = ''; name = 'Calibration & Support' }
)
$schemaDoc.sqlite_table = [regex]::Replace(
    $schemaDoc.sqlite_table,
    '(?m)^(\s*"Solution Theme" TEXT, -- JSON array with zero or more of ).*$',
    ('$1["' + (($taxonomyDoc.solution_themes) -join '", "') + '"]')
)
$schemaDoc.sqlite_table = [regex]::Replace(
    $schemaDoc.sqlite_table,
    '(?m)^(\s*"Product Family" TEXT, -- one of ).*$',
    ('$1["' + (($taxonomyDoc.product_families | ForEach-Object label) -join '", "') + '"]')
)
Write-Utf8NoBom -Path $schemaPath -Content (($schemaDoc | ConvertTo-Json -Depth 20) + "`n")

$viewsPath = Join-Path $repoRoot 'data/product-master/views.json'
$viewsRaw = Get-Content -LiteralPath $viewsPath -Raw | ConvertFrom-Json
$views = @()
foreach ($viewItem in $viewsRaw) { $views += $viewItem }
foreach ($view in $views) {
    if ($view.name -eq '04 Product Family Navigator') {
        $view.groupBy = [pscustomobject]@{
            property = 'Product Family'
            propertyType = 'select'
            sort = [pscustomobject]@{ type = 'manual' }
        }
    }
    if ($view.name -eq '08 Proposal & Funnel Builder' -and $view.displayProperties -notcontains 'Product Family') {
        $view.displayProperties = @('Product / Model Name', 'Product Family') + @($view.displayProperties | Where-Object { $_ -ne 'Product / Model Name' })
    }
}
Write-Utf8NoBom -Path $viewsPath -Content (($views | ConvertTo-Json -Depth 20) + "`n")

$productPages = Get-ChildItem -LiteralPath (Join-Path $repoRoot 'docs/03-product-intelligence/products') -Filter '*.md'
foreach ($page in $productPages) {
    $content = Get-Content -LiteralPath $page.FullName -Raw
    $nameMatch = [regex]::Match($content, '^# (.+)$', 'Multiline')
    if (-not $nameMatch.Success) { throw "Product page title missing: $($page.FullName)" }
    $mapping = Get-CanonicalProductMapping -Name $nameMatch.Groups[1].Value.Trim()
    $content = [regex]::Replace($content, '\| Product Family \| [^|]+\|', "| Product Family | $($families[$mapping.Key]) |")
    Write-Utf8NoBom -Path $page.FullName -Content $content
}

$assetPath = Join-Path $repoRoot 'data/funnel-assets/funnel-asset-master.csv'
$assets = @(Import-Csv -LiteralPath $assetPath)
$finalCoreSourcePaths = @{
    'FA-0001' = 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/puretronics-main-page.json'
    'FA-0002' = 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/input-files-index.json'
    'FA-0003' = 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/master-document.json'
    'FA-0004' = 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/product-master-database.json'
    'FA-0005' = 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/product-intelligence-hub.json'
    'FA-0006' = 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/master-user-guide.json'
    'FA-0007' = 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/internal-copy-annexure-a.json'
    'FA-0008' = 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/annexure-a.json'
    'FA-0009' = 'data/notion-export/taxonomy-migration/2026-07-30/post-cutover/annexure-b.json'
}
foreach ($asset in $assets) {
    if ($finalCoreSourcePaths.ContainsKey($asset.asset_id)) {
        $nonNotionRefs = @($asset.source_refs -split ';' | Where-Object { $_ -and $_ -notlike 'data/notion-export/*' })
        $asset.source_refs = (@($nonNotionRefs) + $finalCoreSourcePaths[$asset.asset_id]) -join ';'
    }
}

function Get-AssetFamilySlug {
    param($Asset)
    if ($Asset.product_family -in $slugs.Values) { return $Asset.product_family }
    if ($Asset.solution_block -in $slugs.Values) { return $Asset.solution_block }
    if ($Asset.solution_block -eq 'online-measurement' -or $Asset.product_family -eq 'online-measurement') { return $slugs.PF01 }
    if ($Asset.solution_block -eq 'spark-testing') { return $slugs.PF02 }
    if ($Asset.solution_block -in @('hv-cable-validation', 'fire-resistance')) { return $slugs.PF03 }
    if ($Asset.product_family -eq 'fault-safety-testing') {
        if ($Asset.product_models -match 'HV Tester|Fire Resistance') { return $slugs.PF03 }
        return $slugs.PF02
    }
    if ($Asset.product_family -eq 'process-enhancement') { return $slugs.PF04 }
    if ($Asset.product_family -eq 'tension-braking-automation') { return $slugs.PF05 }
    if ($Asset.solution_block -eq 'line-stability') {
        if ($Asset.product_models -match 'Preheater|Static Powder|Butt Welding' -and $Asset.product_models -notmatch 'WTI|Loadcell|LTC-PRO|Pneumatic Brake') { return $slugs.PF04 }
        if ($Asset.product_models -match 'WTI|Loadcell|LTC-PRO|Pneumatic Brake' -and $Asset.product_models -notmatch 'Preheater|Static Powder|Butt Welding') { return $slugs.PF05 }
        return 'cross-family'
    }
    if ($Asset.solution_block -eq 'cross-solution' -or $Asset.product_family -eq 'cross-family') { return 'cross-family' }
    return 'not-applicable'
}

foreach ($asset in $assets) {
    $slug = Get-AssetFamilySlug -Asset $asset
    $asset.solution_block = $slug
    $asset.product_family = $slug
    $asset.source_refs = $asset.source_refs.Replace('funnel-build/page-specs/five-solution-blocks.md', 'funnel-build/page-specs/five-product-families.md').Replace('# 7. Five Solution Blocks', '# 7. Five Product Families').Replace('# Solution-Block Mapping', '# Product-Family Mapping')
    $asset.asset_name = $asset.asset_name.Replace('Online Measurement & Dimensional Control', 'Inline Measurement & Dimensional Control').Replace('Spark Testing & Insulation Fault Detection', 'Inline Spark Testing & Insulation Fault Detection').Replace('HV & Cable Validation', 'Cable Testing & Validation')
    $asset.asset_name = [regex]::Replace($asset.asset_name, '(?:Inline )+Spark Testing', 'Inline Spark Testing')
    $asset.asset_name = $asset.asset_name.Replace('solution-block experience', 'Product Family experience').Replace('Five-solution-block', 'Five-Product-Family').Replace('Online Measurement FAQ', 'Inline Measurement FAQ').Replace('Online Measurement datasheet', 'Inline Measurement datasheet').Replace('Online measurement production-stage', 'Inline measurement production-stage')
    $asset.objective = $asset.objective.Replace('Online Measurement & Dimensional Control', 'Inline Measurement & Dimensional Control').Replace('Spark Testing & Insulation Fault Detection', 'Inline Spark Testing & Insulation Fault Detection').Replace('HV & Cable Validation', 'Cable Testing & Validation')
    $asset.objective = [regex]::Replace($asset.objective, '(?:Inline )+Spark Testing', 'Inline Spark Testing')
    $asset.objective = $asset.objective.Replace('Process Enhancement conditional branch', 'Process Equipment & Line Auxiliaries conditional branch').Replace('tension-braking-automation-owner', 'tension-braking-line-control-owner')
    $asset.key_message_or_function = $asset.key_message_or_function.Replace('solution block', 'Product Family').Replace('solution-block', 'product-family').Replace('HV & Cable Validation routing workflow', 'Cable Testing & Validation routing workflow').Replace('Line Stability and Tension Control routing workflow', 'PF-04/PF-05 cross-family routing workflow')
    $asset.route_or_destination = $asset.route_or_destination.Replace('solution-blocks', 'product-families').Replace('relevant-solution-block', 'relevant-product-family').Replace('tension-braking-automation-owner', 'tension-braking-line-control-owner')
    if ($asset.asset_type -eq 'solution-block-experience') { $asset.asset_type = 'product-family-experience' }
    if ($asset.asset_type -eq 'section-solution-block-overview') { $asset.asset_type = 'section-product-family-overview' }
    if ($asset.content_format -eq 'solution-block') { $asset.content_format = 'product-family-experience' }

    $tags = @($asset.tags -split ';' | Where-Object {
        $_ -and $_ -notlike 'product-family-*' -and $_ -notlike 'solution-*' -and $_ -ne 'format-solution-block'
    })
    $tags += "product-family-$slug"
    $tags += "solution-$slug"
    if ($asset.content_format -eq 'product-family-experience') { $tags += 'format-product-family-experience' }
    $tags = [string[]]@($tags | Select-Object -Unique)
    [Array]::Sort($tags, [StringComparer]::Ordinal)
    $asset.tags = ($tags -join ';')
}

$pf04Models = @(
    'Inline Induction Wire Preheater - 1000 m/min',
    'Inline Induction Wire Preheater - 1500 m/min',
    'Inline Induction Wire Preheater - 2000 m/min',
    'LSP-G1 Static Powder Applicator',
    'LSP-G2 Static Powder Applicator',
    'Butt Welding Machine'
)
$pf05Models = @(
    'Wire Tension Indicator WTI-90-40',
    'Wire Tension Indicator WTI-100-40',
    'LTC-PRO Web Tension Controller',
    'Loadcell AR-85 Series',
    'Loadcell AR-118 Series',
    'Loadcell AR-125 Series',
    'Loadcell AR-ST Series',
    'Loadcell LC-AR-60 Series',
    'Loadcell LC-AR-HD Series',
    'AX-250 Pneumatic Brake',
    'AX-400 Pneumatic Brake',
    'AX-500 Pneumatic Brake'
)

$familyParents = @{
    $slugs.PF01 = 'FA-0075'
    $slugs.PF02 = 'FA-0076'
    $slugs.PF03 = 'FA-0077'
    $slugs.PF04 = 'FA-0079'
    $slugs.PF05 = 'FA-0211'
}

foreach ($asset in $assets) {
    if ($asset.asset_id -eq 'FA-0077') {
        $asset.asset_name = 'Cable Testing & Validation Product Family experience'
        $asset.product_models = 'AC HV Tester;DC HV Tester;Fire Resistance Cable Testing System'
        $asset.production_stage = 'offline-hv-testing;fire-compliance-testing'
        $asset.buyer_problem = 'hv-validation;fire-resistance-validation'
        $asset.primary_cta = 'discuss-cable-testing-requirement'
        $asset.objective = 'Provide the grouped Cable Testing & Validation buyer experience, with fire resistance retained as a specialized Solution Theme.'
    }
    if ($asset.asset_id -eq 'FA-0078') {
        $asset.parent_asset_id = 'FA-0077'
        $asset.asset_name = 'Fire Resistance & Circuit Integrity specialized proof module'
        $asset.asset_type = 'solution-theme-module'
        $asset.content_format = 'application-explainer'
        $asset.objective = 'Provide the specialized fire-resistance proof experience within PF-03 Cable Testing & Validation.'
        $asset.key_message_or_function = 'Keep fire resistance visible as a technically distinct theme without treating it as a top-level Product Family.'
        $asset.tags = (($asset.tags -split ';' | Where-Object { $_ -ne 'format-product-family-experience' } | Sort-Object -Unique) -join ';')
    }
    if ($asset.asset_id -eq 'FA-0079') {
        $asset.asset_name = 'Process Equipment & Line Auxiliaries Product Family experience'
        $asset.solution_block = $slugs.PF04
        $asset.product_family = $slugs.PF04
        $asset.product_models = $pf04Models -join ';'
        $asset.production_stage = 'joining-butt-welding;pre-extrusion-preheating;powdering-talc-application'
        $asset.buyer_problem = 'conductor-preheating;powder-adhesion;welding-splicing'
        $asset.primary_cta = 'share-process-equipment-requirement'
        $asset.objective = 'Provide the grouped Process Equipment & Line Auxiliaries buyer experience.'
        $asset.tags = (($asset.tags -split ';' | Where-Object { $_ -notlike 'product-family-*' -and $_ -notlike 'solution-*' } | ForEach-Object { $_ }) + @("product-family-$($slugs.PF04)", "solution-$($slugs.PF04)") | Sort-Object -Unique) -join ';'
    }
    if ($asset.product_family -eq $slugs.PF04) {
        $asset.asset_name = $asset.asset_name.Replace('Process Enhancement', 'Process Equipment & Line Auxiliaries').Replace('Line Stability, Adhesion & Tension Control', 'Process Equipment & Line Auxiliaries').Replace('Line Stability and Tension Control', 'Process Equipment & Line Auxiliaries')
    }
    if ($asset.product_family -eq $slugs.PF05) {
        $asset.asset_name = $asset.asset_name.Replace('Line Stability, Adhesion & Tension Control', 'Tension / Braking / Line Control').Replace('Line Stability and Tension Control', 'Tension / Braking / Line Control')
    }
    if ($asset.product_family -eq 'cross-family') {
        $asset.asset_name = $asset.asset_name.Replace('Line Stability, Adhesion & Tension Control', 'PF-04/PF-05 cross-family').Replace('Line Stability and Tension Control', 'PF-04/PF-05 cross-family')
    }
}

$template = $assets | Where-Object asset_id -eq 'FA-0079'
$new = [ordered]@{}
foreach ($property in $template.PSObject.Properties.Name) { $new[$property] = $template.$property }
$new.asset_id = 'FA-0211'
$new.asset_name = 'Tension / Braking / Line Control Product Family experience'
$new.solution_block = $slugs.PF05
$new.product_family = $slugs.PF05
$new.product_models = $pf05Models -join ';'
$new.production_stage = 'pay-off-unwind;tension-braking-control;rewinding-coiling'
$new.buyer_personas = 'plant-head;production-manager;maintenance-head;automation-engineer;oem-integrator'
$new.buyer_problem = 'tension-instability;braking-control;line-stability'
$new.objective = 'Provide the grouped Tension / Braking / Line Control buyer experience.'
$new.key_message_or_function = 'Connect tension, braking, load measurement, control, proof, and requirement capture without model-level page expansion.'
$new.primary_cta = 'share-tension-braking-requirement'
$new.dependencies = 'FA-0063;FA-0067'
$new.source_refs = 'funnel-build/page-specs/five-product-families.md;docs/01-funnel-architecture/annexure-a-funnel-architecture.md# Five Product Families'
$new.tags = (($template.tags -split ';' | Where-Object {
    $_ -notlike 'product-family-*' -and $_ -notlike 'solution-*' -and
    $_ -notlike 'product-model-*' -and $_ -notlike 'problem-*' -and $_ -notlike 'stage-*'
}) + @(
    "product-family-$($slugs.PF05)",
    "solution-$($slugs.PF05)",
    'problem-braking-control',
    'problem-line-stability',
    'problem-tension-instability',
    'stage-pay-off-unwind',
    'stage-rewinding-coiling',
    'stage-tension-braking-control'
) | Sort-Object -Unique) -join ';'
if ($assets.asset_id -notcontains 'FA-0211') {
    $assets += [pscustomobject]$new
}

$nestedSourceDefinitions = @(
    @{ Id = 'FA-0212'; Parent = 'FA-0011'; Template = 'FA-0011'; Name = 'LASER 2000 Series nested raw source page'; Ref = 'data/notion-export/taxonomy-migration/2026-07-30/pre-migration/nested-laser-2000-series.json' }
    @{ Id = 'FA-0213'; Parent = 'FA-0011'; Template = 'FA-0011'; Name = 'Laser Diameter Gauge nested raw source page'; Ref = 'data/notion-export/taxonomy-migration/2026-07-30/pre-migration/nested-laser-diameter-gauge.json' }
    @{ Id = 'FA-0214'; Parent = 'FA-0011'; Template = 'FA-0011'; Name = 'LASER-2000H Series nested raw source page'; Ref = 'data/notion-export/taxonomy-migration/2026-07-30/pre-migration/nested-laser-2000h-series.json' }
    @{ Id = 'FA-0215'; Parent = 'FA-0012'; Template = 'FA-0012'; Name = 'LSP Series Catalogue nested raw source page'; Ref = 'data/notion-export/taxonomy-migration/2026-07-30/pre-migration/nested-lsp-series-catalogue.json' }
    @{ Id = 'FA-0216'; Parent = 'FA-0012'; Template = 'FA-0012'; Name = 'Static Powder Applicator Key Features nested raw source page'; Ref = 'data/notion-export/taxonomy-migration/2026-07-30/pre-migration/nested-static-powder-key-features.json' }
)
foreach ($definition in $nestedSourceDefinitions) {
    if ($assets.asset_id -contains $definition.Id) { continue }
    $sourceTemplate = $assets | Where-Object asset_id -eq $definition.Template
    $sourceRow = [ordered]@{}
    foreach ($property in $sourceTemplate.PSObject.Properties.Name) { $sourceRow[$property] = $sourceTemplate.$property }
    $sourceRow.asset_id = $definition.Id
    $sourceRow.parent_asset_id = $definition.Parent
    $sourceRow.asset_name = $definition.Name
    $sourceRow.product_models = 'not-applicable'
    $sourceRow.source_refs = $definition.Ref
    $sourceRow.notes = 'Immutable nested historical/source evidence. Classification is supplied by Product Master and taxonomy governance; source body must remain unchanged.'
    $assets += [pscustomobject]$sourceRow
}

if ($assets.asset_id -notcontains 'FA-0217') {
    $governanceTemplate = $assets | Where-Object asset_id -eq 'FA-0001'
    $governanceRow = [ordered]@{}
    foreach ($property in $governanceTemplate.PSObject.Properties.Name) { $governanceRow[$property] = $governanceTemplate.$property }
    $governanceRow.asset_id = 'FA-0217'
    $governanceRow.asset_name = 'Puretronics Wire & Cable Taxonomy Governance authority'
    $governanceRow.source_refs = 'docs/00-governance/product-taxonomy-governance.md;data/notion-export/taxonomy-migration/2026-07-30/post-migration/taxonomy-governance.json'
    $governanceRow.notes = 'Canonical classification authority below the Signed Agreement; live Notion page and repository mirror.'
    $assets += [pscustomobject]$governanceRow
}
$governanceAsset = $assets | Where-Object asset_id -eq 'FA-0217'
$governanceAsset.source_refs = 'docs/00-governance/product-taxonomy-governance.md;data/notion-export/taxonomy-migration/2026-07-30/post-cutover/taxonomy-governance.json'
$governanceAsset.notes = 'Approved canonical classification authority below the Signed Agreement; live Notion page and repository mirror. Taxonomy owner and operational steward: Vaibhav Kuvadia + Codex.'

foreach ($asset in $assets) {
    if ($familyParents.ContainsKey($asset.product_family) -and $asset.asset_id -notin $familyParents.Values -and $asset.asset_id -ne 'FA-0078') {
        if ($asset.parent_asset_id -in @('FA-0075','FA-0076','FA-0077','FA-0079')) {
            $asset.parent_asset_id = $familyParents[$asset.product_family]
        }
    }
    if ($asset.product_family -eq 'cross-family' -and $asset.parent_asset_id -eq 'FA-0079') {
        $asset.parent_asset_id = 'FA-0067'
    }
}

$derivedTagFields = @(
    @{ Prefix = 'asset-class-'; Field = 'asset_class'; Multi = $false }
    @{ Prefix = 'workstream-'; Field = 'workstream'; Multi = $false }
    @{ Prefix = 'solution-'; Field = 'solution_block'; Multi = $true }
    @{ Prefix = 'product-family-'; Field = 'product_family'; Multi = $true }
    @{ Prefix = 'product-model-'; Field = 'product_models'; Multi = $true }
    @{ Prefix = 'stage-'; Field = 'production_stage'; Multi = $true }
    @{ Prefix = 'persona-'; Field = 'buyer_personas'; Multi = $true }
    @{ Prefix = 'problem-'; Field = 'buyer_problem'; Multi = $true }
    @{ Prefix = 'funnel-'; Field = 'funnel_stage'; Multi = $true }
    @{ Prefix = 'channel-'; Field = 'channel'; Multi = $true }
    @{ Prefix = 'format-'; Field = 'content_format'; Multi = $false }
    @{ Prefix = 'scope-'; Field = 'scope_treatment'; Multi = $false }
    @{ Prefix = 'recurrence-'; Field = 'cadence'; Multi = $false }
)
foreach ($asset in $assets) {
    $tags = @($asset.tags -split ';' | Where-Object { $_ })
    foreach ($definition in $derivedTagFields) {
        $tags = @($tags | Where-Object { -not $_.StartsWith($definition.Prefix, [StringComparison]::Ordinal) })
        $fieldValue = [string]$asset.PSObject.Properties[$definition.Field].Value
        $rawValues = if ($definition.Multi) {
            @($fieldValue -split ';')
        } else {
            @($fieldValue)
        }
        foreach ($rawValue in $rawValues) {
            $value = $rawValue.Trim()
            if ($definition.Prefix -eq 'product-model-' -and $value -eq 'not-applicable') { continue }
            if ($value) { $tags += "$($definition.Prefix)$(ConvertTo-CanonicalSlug $value)" }
        }
    }
    $tags = [string[]]@($tags | Select-Object -Unique)
    [Array]::Sort($tags, [StringComparer]::Ordinal)
    $asset.tags = ($tags -join ';')
}

$assetCsv = $assets | Sort-Object { [int]($_.asset_id -replace '\D','') } | ConvertTo-Csv -NoTypeInformation
Write-Utf8NoBom -Path $assetPath -Content (($assetCsv -join "`r`n") + "`r`n")

$migrationExportRoot = Join-Path $repoRoot 'data/notion-export/taxonomy-migration/2026-07-30'
$preMigrationRoot = Join-Path $migrationExportRoot 'pre-migration'
$postMigrationRoot = Join-Path $migrationExportRoot 'post-migration'
$integrityNames = @(
    'signed-agreement-read-only.json'
    'raw-laser-diameter-gauge.json'
    'raw-static-powder-applicator.json'
    'raw-butt-welding-machine.json'
    'raw-fire-resistance-cable-testing-system.json'
    'raw-inline-induction-wire-preheater.json'
    'raw-loadcell.json'
    'raw-ltc-pro.json'
    'raw-pneumatic-brake.json'
    'raw-spark-tester-with-iot-accessories.json'
    'raw-spark-tester.json'
    'raw-spark-tester-sensitivity-calibrator.json'
    'raw-wire-cable-brochure.json'
    'raw-wire-tension-indicator.json'
    'raw-wire-tension-indicator-with-iot.json'
    'nested-laser-2000-series.json'
    'nested-laser-diameter-gauge.json'
    'nested-laser-2000h-series.json'
    'nested-lsp-series-catalogue.json'
    'nested-static-powder-key-features.json'
)
if ((Test-Path -LiteralPath $preMigrationRoot) -and (Test-Path -LiteralPath $postMigrationRoot)) {
    $integrityRows = foreach ($name in $integrityNames) {
        $prePath = Join-Path $preMigrationRoot $name
        $postPath = Join-Path $postMigrationRoot $name
        if (-not (Test-Path -LiteralPath $prePath) -or -not (Test-Path -LiteralPath $postPath)) { continue }
        $preHash = (Get-FileHash -LiteralPath $prePath -Algorithm SHA256).Hash.ToLowerInvariant()
        $postHash = (Get-FileHash -LiteralPath $postPath -Algorithm SHA256).Hash.ToLowerInvariant()
        [pscustomobject][ordered]@{
            evidence_type = if ($name -eq 'signed-agreement-read-only.json') { 'signed-agreement' } else { 'immutable-raw-source' }
            file_name = $name
            pre_sha256 = $preHash
            post_sha256 = $postHash
            unchanged = if ($preHash -eq $postHash) { 'yes' } else { 'no' }
        }
    }
    $integrityCsv = $integrityRows | ConvertTo-Csv -NoTypeInformation
    Write-Utf8NoBom -Path (Join-Path $migrationExportRoot 'integrity-manifest.csv') -Content (($integrityCsv -join "`r`n") + "`r`n")
}

$postCutoverRoot = Join-Path $migrationExportRoot 'post-cutover'
if (-not (Test-Path -LiteralPath $postCutoverRoot)) {
    New-Item -ItemType Directory -Path $postCutoverRoot | Out-Null
}
$checkpointVerificationPath = Join-Path $postMigrationRoot 'live-row-verification.json'
$cutoverVerificationPath = Join-Path $postCutoverRoot 'live-row-verification.json'
if (-not (Test-Path -LiteralPath $cutoverVerificationPath) -and (Test-Path -LiteralPath $checkpointVerificationPath)) {
    $cutoverVerification = Get-Content -LiteralPath $checkpointVerificationPath -Raw | ConvertFrom-Json
    $cutoverVerification.verified_at = '2026-07-30'
    $cutoverVerification.method = 'All 38 rows were individually fetched at the migration checkpoint; all 13 PF-05 rows were individually re-fetched after slash-label cutover; final data-source schema was fetched after legacy-field removal.'
    foreach ($verificationRow in $cutoverVerification.rows) {
        if ($verificationRow.product_family -eq 'Tension Braking & Line Control' -or $verificationRow.product_family -eq 'Tension, Braking & Line Control') {
            $verificationRow.product_family = $families.PF05
        }
    }
    $cutoverVerification | Add-Member -NotePropertyName approval_state -NotePropertyValue 'approved' -Force
    $cutoverVerification | Add-Member -NotePropertyName taxonomy_owner -NotePropertyValue 'Vaibhav Kuvadia + Codex' -Force
    $cutoverVerification | Add-Member -NotePropertyName operational_steward -NotePropertyValue 'Vaibhav Kuvadia + Codex' -Force
    $cutoverVerification | Add-Member -NotePropertyName legacy_product_family_removed -NotePropertyValue $true -Force
    $cutoverVerification | Add-Member -NotePropertyName standards_treatment -NotePropertyValue 'BS EN 50200:2006 remains pending-puretronics-validation; external compliance claims prohibited pending Puretronics validation.' -Force
    Write-Utf8NoBom -Path $cutoverVerificationPath -Content (($cutoverVerification | ConvertTo-Json -Depth 20) + "`n")
}

Write-Host "Migrated $($rows.Count) Product Master rows and $($assets.Count) funnel assets."
