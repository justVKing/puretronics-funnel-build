$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]

$targetFiles = @(
    'README.md',
    'migration-manifest.md',
    'docs/00-governance/signed-scope-summary.md',
    'docs/00-governance/services-agreement-final-signature-copy.md',
    'docs/01-funnel-architecture/annexure-a-funnel-architecture.md',
    'docs/02-commercial/annexure-b-commercial-structure-pricing.md',
    'funnel-build/page-specs/wire-cable-industry-landing-page.md',
    'funnel-build/page-specs/five-solution-blocks.md',
    'funnel-build/technical-library/proof-stack.md',
    'funnel-build/forms-and-routing/adaptive-requirement-form-routing.md',
    'funnel-build/dashboard-and-reporting/dashboard-reporting-model.md',
    'activation/monthly-operating-system/README.md'
)

$combined = ''
foreach ($file in $targetFiles) {
    $path = Join-Path $root $file
    if (-not (Test-Path -LiteralPath $path)) {
        $failures.Add("Missing signed-scope file: $file")
        continue
    }
    $combined += "`n--- $file ---`n"
    $combined += Get-Content -Raw -LiteralPath $path
}

$requiredFacts = @(
    '9 July 2026',
    '15 July 2026 to 31 December 2027',
    'July-August 2026',
    'September 2026 to December 2027',
    'INR 5,50,000',
    'INR 65,000/month',
    'INR 10,40,000',
    'INR 15,90,000',
    'LTC-PRO Web Tension Controller',
    'support items',
    'separately approved in writing'
)

foreach ($fact in $requiredFacts) {
    if ($combined -notlike "*$fact*") {
        $failures.Add("Missing signed-scope fact: $fact")
    }
}

$forbiddenActiveClaims = @(
    'INR 5,00,000 one-time',
    'INR 8,00,000 Optional Enhanced Version',
    '100% payable in advance',
    '12 months recommended',
    '30-day written notice after minimum commitment'
)

foreach ($claim in $forbiddenActiveClaims) {
    if ($combined -like "*$claim*") {
        $failures.Add("Forbidden active claim found: $claim")
    }
}

$section7BadSnippets = @(
    'LTC-PRO input/output and integration notes',
    'Pneumatic brake torque / pressure / RPM table',
    'Butt welding suitability table'
)

$annexureA = Get-Content -Raw -LiteralPath (Join-Path $root 'docs/01-funnel-architecture/annexure-a-funnel-architecture.md')
foreach ($snippet in $section7BadSnippets) {
    if ($annexureA -like "*$snippet*") {
        $failures.Add("Malformed Annexure A Section 7 residue found: $snippet")
    }
}

if ($failures.Count -gt 0) {
    Write-Host 'Signed-scope validation failed:'
    $failures | ForEach-Object { Write-Host "- $_" }
    exit 1
}

Write-Host 'Signed-scope validation passed.'
