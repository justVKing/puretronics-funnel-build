$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$csvPath = Join-Path $root 'data/funnel-assets/funnel-asset-master.csv'
$taxonomyPath = Join-Path $root 'data/funnel-assets/tag-taxonomy.md'
$productRowsPath = Join-Path $root 'data/product-master/rows.json'
$sourceMapPath = Join-Path $root 'notion-source-map.json'
$failures = New-Object System.Collections.Generic.List[string]

$requiredColumns = @(
    'asset_id',
    'parent_asset_id',
    'asset_name',
    'asset_class',
    'asset_type',
    'workstream',
    'solution_block',
    'product_family',
    'product_models',
    'production_stage',
    'buyer_personas',
    'buyer_problem',
    'funnel_stage',
    'channel',
    'content_format',
    'objective',
    'key_message_or_function',
    'primary_cta',
    'route_or_destination',
    'cadence',
    'quantity',
    'scope_treatment',
    'mvp_required',
    'priority',
    'content_status',
    'design_status',
    'build_status',
    'technical_validation_status',
    'approval_status',
    'owner',
    'dependencies',
    'source_refs',
    'tags',
    'notes'
)

function Add-Failure {
    param([string]$Message)
    $failures.Add($Message)
}

function ConvertTo-CanonicalSlug {
    param([string]$Value)

    $normalized = $Value.Normalize([Text.NormalizationForm]::FormD)
    $builder = New-Object Text.StringBuilder
    foreach ($character in $normalized.ToCharArray()) {
        $category = [Globalization.CharUnicodeInfo]::GetUnicodeCategory($character)
        if ($category -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$builder.Append($character)
        }
    }

    $slug = $builder.ToString().ToLowerInvariant().Replace('&', ' and ')
    $slug = [regex]::Replace($slug, '[^a-z0-9]+', '-').Trim('-')
    return $slug
}

function Split-MultiValue {
    param([string]$Value)
    return @(
        $Value.Split(';', [StringSplitOptions]::RemoveEmptyEntries) |
            ForEach-Object { $_.Trim() } |
            Where-Object { $_ }
    )
}

function Test-StrictCsvSyntax {
    param(
        [string]$Text,
        [int]$ExpectedColumnCount
    )

    $rowColumnCounts = New-Object System.Collections.Generic.List[int]
    $inQuotes = $false
    $atFieldStart = $true
    $afterClosingQuote = $false
    $columnCount = 1
    $rowNumber = 1

    for ($index = 0; $index -lt $Text.Length; $index++) {
        $character = $Text[$index]

        if ($inQuotes) {
            if ($character -eq '"') {
                if ($index + 1 -lt $Text.Length -and $Text[$index + 1] -eq '"') {
                    $index++
                } else {
                    $inQuotes = $false
                    $afterClosingQuote = $true
                }
            }
            continue
        }

        if ($afterClosingQuote) {
            if ($character -eq ',') {
                $columnCount++
                $atFieldStart = $true
                $afterClosingQuote = $false
                continue
            }

            if ($character -eq "`r" -or $character -eq "`n") {
                $rowColumnCounts.Add($columnCount)
                if ($character -eq "`r" -and $index + 1 -lt $Text.Length -and $Text[$index + 1] -eq "`n") {
                    $index++
                }
                $columnCount = 1
                $atFieldStart = $true
                $afterClosingQuote = $false
                $rowNumber++
                continue
            }

            Add-Failure "Invalid CSV quoting at row ${rowNumber}: non-delimiter character after a closing quote."
            return
        }

        if ($character -eq '"') {
            if (-not $atFieldStart) {
                Add-Failure "Invalid CSV quoting at row ${rowNumber}: quote found inside an unquoted field."
                return
            }
            $inQuotes = $true
            $atFieldStart = $false
            continue
        }

        if ($character -eq ',') {
            $columnCount++
            $atFieldStart = $true
            continue
        }

        if ($character -eq "`r" -or $character -eq "`n") {
            $rowColumnCounts.Add($columnCount)
            if ($character -eq "`r" -and $index + 1 -lt $Text.Length -and $Text[$index + 1] -eq "`n") {
                $index++
            }
            $columnCount = 1
            $atFieldStart = $true
            $rowNumber++
            continue
        }

        $atFieldStart = $false
    }

    if ($inQuotes) {
        Add-Failure 'Invalid CSV quoting: unclosed quoted field at end of file.'
        return
    }

    if (-not $Text.EndsWith("`n")) {
        $rowColumnCounts.Add($columnCount)
    }

    for ($index = 0; $index -lt $rowColumnCounts.Count; $index++) {
        if ($rowColumnCounts[$index] -ne $ExpectedColumnCount) {
            Add-Failure "CSV row $($index + 1) has $($rowColumnCounts[$index]) columns; expected $ExpectedColumnCount."
        }
    }
}

foreach ($requiredFile in @($csvPath, $taxonomyPath, $productRowsPath, $sourceMapPath)) {
    if (-not (Test-Path -LiteralPath $requiredFile -PathType Leaf)) {
        Add-Failure "Missing required validation input: $requiredFile"
    }
}

if ($failures.Count -gt 0) {
    Write-Host 'Funnel asset master validation failed:'
    $failures | ForEach-Object { Write-Host "- $_" }
    exit 1
}

try {
    $utf8 = New-Object Text.UTF8Encoding($false, $true)
    $csvText = $utf8.GetString([IO.File]::ReadAllBytes($csvPath))
} catch {
    Add-Failure 'CSV is not valid UTF-8.'
    $csvText = ''
}

if ($csvText) {
    Test-StrictCsvSyntax -Text $csvText -ExpectedColumnCount $requiredColumns.Count
}

try {
    $rows = @(Import-Csv -LiteralPath $csvPath -Encoding UTF8)
} catch {
    Add-Failure "CSV parsing failed: $($_.Exception.Message)"
    $rows = @()
}

if ($rows.Count -eq 0) {
    Add-Failure 'CSV contains no asset rows.'
} else {
    $actualColumns = @($rows[0].PSObject.Properties.Name)
    if (($actualColumns -join '|') -ne ($requiredColumns -join '|')) {
        Add-Failure "Required columns are missing or out of order. Expected: $($requiredColumns -join ', ')"
    }
}

$requiredNonBlankColumns = @(
    'asset_id',
    'asset_name',
    'asset_class',
    'asset_type',
    'workstream',
    'solution_block',
    'product_family',
    'product_models',
    'production_stage',
    'buyer_personas',
    'buyer_problem',
    'funnel_stage',
    'channel',
    'content_format',
    'objective',
    'key_message_or_function',
    'primary_cta',
    'route_or_destination',
    'cadence',
    'quantity',
    'scope_treatment',
    'mvp_required',
    'priority',
    'content_status',
    'design_status',
    'build_status',
    'technical_validation_status',
    'approval_status',
    'owner',
    'dependencies',
    'source_refs',
    'tags',
    'notes'
)

$allowedAssetClasses = @(
    'source-asset',
    'page',
    'section',
    'module',
    'form',
    'form-path',
    'workflow',
    'proof-asset',
    'dashboard',
    'report',
    'activation-series',
    'operational-asset',
    'governance-asset',
    'qa-asset',
    'integration-asset'
)
$allowedWorkstreams = @(
    'governance',
    'source-intelligence',
    'website-experience',
    'technical-library',
    'forms-and-routing',
    'dashboard-and-reporting',
    'activation-content',
    'linkedin-outreach',
    'cold-email',
    'integrations',
    'operations',
    'qa-and-deployment'
)
$allowedSolutionBlocks = @(
    'inline-measurement-dimensional-control',
    'inline-spark-testing-insulation-fault-detection',
    'cable-testing-validation',
    'process-equipment-line-auxiliaries',
    'tension-braking-line-control',
    'cross-family',
    'not-applicable'
)
$requiredSolutionBlocks = @(
    'inline-measurement-dimensional-control',
    'inline-spark-testing-insulation-fault-detection',
    'cable-testing-validation',
    'process-equipment-line-auxiliaries',
    'tension-braking-line-control'
)
$allowedProductFamilies = @(
    'inline-measurement-dimensional-control',
    'inline-spark-testing-insulation-fault-detection',
    'cable-testing-validation',
    'process-equipment-line-auxiliaries',
    'tension-braking-line-control',
    'cross-family',
    'not-applicable'
)
$allowedScopeTreatments = @(
    'signed-primary',
    'covered-support',
    'funnel-operational',
    'governance',
    'approval-required',
    'excluded-reference-only'
)
$allowedPriorities = @('critical', 'high', 'medium', 'low')
$allowedMvpValues = @('yes', 'no', 'decision-required')
$allowedStatusValues = @(
    'not-started',
    'specified',
    'in-progress',
    'ready-for-review',
    'approved',
    'built',
    'not-applicable',
    'blocked',
    'decision-required'
)
$allowedTechnicalValidationValues = @(
    'not-required',
    'pending-puretronics-validation',
    'validated',
    'decision-required'
)
$allowedCadenceValues = @(
    'not-applicable',
    'one-time',
    'continuous',
    'as-needed',
    'monthly',
    'per-prospect',
    'per-release'
)

$taxonomyText = Get-Content -Raw -LiteralPath $taxonomyPath
$registryMatch = [regex]::Match(
    $taxonomyText,
    '<!-- canonical-tags:start -->\s*(.*?)\s*<!-- canonical-tags:end -->',
    [Text.RegularExpressions.RegexOptions]::Singleline
)
$documentedTags = @()
if (-not $registryMatch.Success) {
    Add-Failure 'Tag taxonomy is missing the canonical tag registry markers.'
} else {
    $documentedTags = @(
        $registryMatch.Groups[1].Value -split '\r?\n' |
            ForEach-Object { $_.Trim() } |
            Where-Object { $_ }
    )
    $duplicateDocumentedTags = @(
        $documentedTags |
            Group-Object |
            Where-Object { $_.Count -gt 1 }
    )
    foreach ($duplicate in $duplicateDocumentedTags) {
        Add-Failure "Tag taxonomy contains duplicate canonical tag: $($duplicate.Name)"
    }
}

$assetIds = @($rows | ForEach-Object { $_.asset_id })
$duplicateIds = @($assetIds | Group-Object | Where-Object { $_.Count -gt 1 })
foreach ($duplicate in $duplicateIds) {
    Add-Failure "Duplicate asset_id: $($duplicate.Name)"
}

$duplicateNames = @($rows | Group-Object asset_name | Where-Object { $_.Count -gt 1 })
foreach ($duplicate in $duplicateNames) {
    Add-Failure "Duplicate asset_name: $($duplicate.Name)"
}

$requiredTagPrefixes = @(
    'asset-class-',
    'workstream-',
    'solution-',
    'product-family-',
    'stage-',
    'persona-',
    'problem-',
    'funnel-',
    'channel-',
    'format-',
    'scope-',
    'readiness-',
    'validation-',
    'recurrence-'
)

foreach ($row in $rows) {
    $label = if ($row.asset_id) { $row.asset_id } else { '<missing-id>' }

    foreach ($column in $requiredNonBlankColumns) {
        if ([string]::IsNullOrWhiteSpace([string]$row.$column)) {
            Add-Failure "$label has a blank required field: $column"
        }
    }

    if ($row.asset_id -notmatch '^FA-\d{4}$') {
        Add-Failure "Malformed asset_id: $($row.asset_id)"
    }

    if ($row.parent_asset_id) {
        if ($row.parent_asset_id -notmatch '^FA-\d{4}$') {
            Add-Failure "$label has malformed parent_asset_id: $($row.parent_asset_id)"
        } elseif ($row.parent_asset_id -notin $assetIds) {
            Add-Failure "$label references unknown parent_asset_id: $($row.parent_asset_id)"
        } elseif ($row.parent_asset_id -eq $row.asset_id) {
            Add-Failure "$label cannot be its own parent."
        }
    }

    if ($row.dependencies -ne 'not-applicable') {
        foreach ($dependency in (Split-MultiValue $row.dependencies)) {
            if ($dependency -notin $assetIds) {
                Add-Failure "$label references unknown dependency: $dependency"
            }
            if ($dependency -eq $row.asset_id) {
                Add-Failure "$label cannot depend on itself."
            }
        }
    }

    if ($row.asset_class -notin $allowedAssetClasses) {
        Add-Failure "$label has unknown asset_class: $($row.asset_class)"
    }
    if ($row.workstream -notin $allowedWorkstreams) {
        Add-Failure "$label has unknown workstream: $($row.workstream)"
    }
    foreach ($solution in (Split-MultiValue $row.solution_block)) {
        if ($solution -notin $allowedSolutionBlocks) {
            Add-Failure "$label has unknown solution_block: $solution"
        }
    }
    foreach ($family in (Split-MultiValue $row.product_family)) {
        if ($family -notin $allowedProductFamilies) {
            Add-Failure "$label has unknown product_family: $family"
        }
    }
    if ($row.scope_treatment -notin $allowedScopeTreatments) {
        Add-Failure "$label has unknown scope_treatment: $($row.scope_treatment)"
    }
    if ($row.priority -notin $allowedPriorities) {
        Add-Failure "$label has unknown priority: $($row.priority)"
    }
    if ($row.mvp_required -notin $allowedMvpValues) {
        Add-Failure "$label has unknown mvp_required value: $($row.mvp_required)"
    }
    foreach ($column in @('content_status', 'design_status', 'build_status', 'approval_status')) {
        if ($row.$column -notin $allowedStatusValues) {
            Add-Failure "$label has unknown $column value: $($row.$column)"
        }
    }
    if ($row.technical_validation_status -notin $allowedTechnicalValidationValues) {
        Add-Failure "$label has unknown technical_validation_status: $($row.technical_validation_status)"
    }
    if ($row.cadence -notin $allowedCadenceValues) {
        Add-Failure "$label has unknown cadence: $($row.cadence)"
    }

    $tags = @(Split-MultiValue $row.tags)
    if ($tags.Count -eq 0) {
        Add-Failure "$label has no tags."
    }

    $duplicateTags = @($tags | Group-Object | Where-Object { $_.Count -gt 1 })
    foreach ($duplicate in $duplicateTags) {
        Add-Failure "$label contains duplicate tag: $($duplicate.Name)"
    }

    $sortedTags = [string[]]$tags.Clone()
    [Array]::Sort($sortedTags, [StringComparer]::Ordinal)
    if (($tags -join ';') -ne ($sortedTags -join ';')) {
        Add-Failure "$label tags are not sorted consistently."
    }

    foreach ($tag in $tags) {
        if ($tag -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') {
            Add-Failure "$label has malformed tag: $tag"
        }
        if ($tag -notin $documentedTags) {
            Add-Failure "$label uses undocumented canonical tag: $tag"
        }
    }

    foreach ($prefix in $requiredTagPrefixes) {
        if (-not ($tags | Where-Object { $_.StartsWith($prefix, [StringComparison]::Ordinal) })) {
            Add-Failure "$label is missing required tag family: $prefix"
        }
    }

    $fieldTagChecks = @(
        @{ Prefix = 'asset-class-'; Values = @($row.asset_class) },
        @{ Prefix = 'workstream-'; Values = @($row.workstream) },
        @{ Prefix = 'solution-'; Values = @(Split-MultiValue $row.solution_block) },
        @{ Prefix = 'product-family-'; Values = @(Split-MultiValue $row.product_family) },
        @{ Prefix = 'stage-'; Values = @(Split-MultiValue $row.production_stage) },
        @{ Prefix = 'persona-'; Values = @(Split-MultiValue $row.buyer_personas) },
        @{ Prefix = 'problem-'; Values = @(Split-MultiValue $row.buyer_problem) },
        @{ Prefix = 'funnel-'; Values = @(Split-MultiValue $row.funnel_stage) },
        @{ Prefix = 'channel-'; Values = @(Split-MultiValue $row.channel) },
        @{ Prefix = 'format-'; Values = @($row.content_format) },
        @{ Prefix = 'scope-'; Values = @($row.scope_treatment) },
        @{ Prefix = 'recurrence-'; Values = @($row.cadence) }
    )
    foreach ($check in $fieldTagChecks) {
        foreach ($value in $check.Values) {
            $expectedTag = "$($check.Prefix)$(ConvertTo-CanonicalSlug $value)"
            if ($expectedTag -notin $tags) {
                Add-Failure "$label is missing field-derived tag: $expectedTag"
            }
        }
    }

    if ($row.product_models -ne 'not-applicable') {
        foreach ($model in (Split-MultiValue $row.product_models)) {
            $expectedTag = "product-model-$(ConvertTo-CanonicalSlug $model)"
            if ($expectedTag -notin $tags) {
                Add-Failure "$label is missing product/model tag: $expectedTag"
            }
        }
    }

    foreach ($sourceRef in (Split-MultiValue $row.source_refs)) {
        $relativePath = [regex]::Replace($sourceRef, '#.*$', '').Trim()
        if (-not $relativePath) {
            Add-Failure "$label contains an empty source path."
            continue
        }
        $fullPath = Join-Path $root ($relativePath.Replace('/', [IO.Path]::DirectorySeparatorChar))
        if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
            Add-Failure "$label source reference does not point to an existing file: $relativePath"
        }
    }
}

$solutionExperienceRows = @($rows | Where-Object { $_.asset_type -eq 'product-family-experience' })
foreach ($requiredSolution in $requiredSolutionBlocks) {
    if (-not ($solutionExperienceRows | Where-Object { $_.solution_block -eq $requiredSolution })) {
        Add-Failure "Missing required Product Family experience: $requiredSolution"
    }
}
if ($solutionExperienceRows.Count -ne 5) {
    Add-Failure "Expected exactly five top-level Product Family experiences; found $($solutionExperienceRows.Count)."
}
foreach ($experience in $solutionExperienceRows) {
    if ($experience.solution_block -ne $experience.product_family) {
        Add-Failure "$($experience.asset_id) must mirror solution_block to product_family."
    }
}
if (-not ($rows | Where-Object {
    $_.asset_id -eq 'FA-0078' -and
    $_.parent_asset_id -eq 'FA-0077' -and
    $_.asset_type -eq 'solution-theme-module' -and
    $_.product_family -eq 'cable-testing-validation'
})) {
    Add-Failure 'Fire Resistance & Circuit Integrity is not represented as a PF-03 child theme/module.'
}

$requiredFormPaths = @(
    'Sales enquiry form entry path',
    'Technical proof request form entry path',
    'Service/support form entry path',
    'Existing customer expansion form entry path'
)
foreach ($requiredFormPath in $requiredFormPaths) {
    if (-not ($rows | Where-Object {
        $_.asset_type -eq 'form-entry-path' -and $_.asset_name -eq $requiredFormPath
    })) {
        Add-Failure "Missing required form entry path: $requiredFormPath"
    }
}

$requiredDashboardViews = @(
    'Product-family demand dashboard view',
    'Buyer segments dashboard view',
    'Problem and process-stage demand dashboard view',
    'Enquiry quality dashboard view',
    'Routing ownership dashboard view',
    'LinkedIn outreach dashboard view',
    'Cold email dashboard view',
    'Monthly activation outputs dashboard view'
)
foreach ($requiredDashboardView in $requiredDashboardViews) {
    if (-not ($rows | Where-Object {
        $_.asset_type -eq 'dashboard-view' -and $_.asset_name -eq $requiredDashboardView
    })) {
        Add-Failure "Missing required dashboard view: $requiredDashboardView"
    }
}
if (-not ($rows | Where-Object { $_.asset_name -eq 'Monthly reporting pack' })) {
    Add-Failure 'Missing required monthly reporting pack.'
}

$requiredActivationAssets = @(
    @{ Name = 'Technical thought-leadership/document asset series'; Tag = 'commitment-technical-assets-monthly' },
    @{ Name = 'Company Page distribution post/asset series'; Tag = 'commitment-company-page-assets-monthly' },
    @{ Name = 'Leadership or sales-profile LinkedIn post/asset series'; Tag = 'commitment-leadership-assets-monthly' },
    @{ Name = 'LinkedIn outreach program'; Tag = 'commitment-linkedin-prospects-monthly' },
    @{ Name = 'LinkedIn connection and follow-up sequence family'; Tag = '' },
    @{ Name = 'Cold email outreach program'; Tag = 'commitment-cold-email-sends-monthly' },
    @{ Name = 'Core cold-email sequence template family'; Tag = '' },
    @{ Name = 'Cold-email basic reply triage workflow'; Tag = '' },
    @{ Name = 'Cold-email CSV/manual lead handoff asset'; Tag = '' }
)
foreach ($requiredActivationAsset in $requiredActivationAssets) {
    $match = @($rows | Where-Object { $_.asset_name -eq $requiredActivationAsset.Name })
    if ($match.Count -eq 0) {
        Add-Failure "Missing required activation asset: $($requiredActivationAsset.Name)"
        continue
    }
    if ($requiredActivationAsset.Tag -and $match[0].tags -notlike "*$($requiredActivationAsset.Tag)*") {
        Add-Failure "Activation asset is missing signed commitment tag: $($requiredActivationAsset.Tag)"
    }
}

$sourceMap = Get-Content -Raw -LiteralPath $sourceMapPath | ConvertFrom-Json
$mappedRawPaths = @(
    @($sourceMap.core_pages) + @($sourceMap.raw_input_pages) |
        ForEach-Object { $_.raw_fetch_path }
)
foreach ($mappedRawPath in $mappedRawPaths) {
    if (-not ($rows | Where-Object {
        (Split-MultiValue $_.source_refs) -contains $mappedRawPath -or
        (Split-MultiValue $_.source_refs | ForEach-Object { [regex]::Replace($_, '#.*$', '').Trim() }) -contains $mappedRawPath
    })) {
        Add-Failure "Mapped core/raw Notion source is not represented: $mappedRawPath"
    }
}

$productRowsRaw = Get-Content -Raw -LiteralPath $productRowsPath | ConvertFrom-Json
$productRows = @()
foreach ($productRowItem in $productRowsRaw) {
    $productRows += $productRowItem
}
$contextRows = @($rows | Where-Object { $_.asset_class -ne 'source-asset' })
$contextModels = @(
    $contextRows |
        ForEach-Object { Split-MultiValue $_.product_models } |
        Where-Object { $_ -ne 'not-applicable' }
)
foreach ($productRow in $productRows) {
    $productName = $productRow.'Product / Model Name'
    if ($productName -notin $contextModels) {
        Add-Failure "Product Master row is not mapped to a non-source funnel/proof context: $productName"
    }
}

$supportNames = @(
    $productRows |
        Where-Object { $_.'Signed Scope Treatment' -eq 'Covered Support Item' } |
        ForEach-Object { $_.'Product / Model Name' }
)
$forbiddenSupportClasses = @('page', 'form', 'form-path', 'activation-series')
$forbiddenSupportTypePattern = '(?i)(standalone|page|campaign|automation|seo|selector|calculator|configurator)'
foreach ($row in $contextRows) {
    $rowModels = @(Split-MultiValue $row.product_models)
    $supportIntersection = @($rowModels | Where-Object { $_ -in $supportNames })
    if ($supportIntersection.Count -eq 0) {
        continue
    }
    if ($row.scope_treatment -ne 'covered-support') {
        Add-Failure "$($row.asset_id) maps a support item without scope_treatment=covered-support: $($supportIntersection -join ', ')"
    }
    if ($row.asset_class -in $forbiddenSupportClasses -or $row.asset_type -match $forbiddenSupportTypePattern) {
        Add-Failure "$($row.asset_id) incorrectly represents a covered support item as a standalone deliverable: $($supportIntersection -join ', ')"
    }
}

if ($failures.Count -gt 0) {
    Write-Host 'Funnel asset master validation failed:'
    $failures | ForEach-Object { Write-Host "- $_" }
    exit 1
}

Write-Host "Funnel asset master validation passed: $($rows.Count) assets, $($documentedTags.Count) documented tags, $($productRows.Count)/$($productRows.Count) Product Master rows mapped."
