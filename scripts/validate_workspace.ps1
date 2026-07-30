$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]

function Require-File {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath (Join-Path $root $Path))) {
        $failures.Add("Missing file: $Path")
    }
}

function Require-Text {
    param([string]$Path, [string]$Needle)
    $fullPath = Join-Path $root $Path
    if (-not (Test-Path -LiteralPath $fullPath)) {
        $failures.Add("Missing file for text check: $Path")
        return
    }
    $content = Get-Content -Raw -LiteralPath $fullPath
    if ($content -notlike "*$Needle*") {
        $failures.Add("Missing text in ${Path}: $Needle")
    }
}

Require-File 'notion-source-map.json'
Require-File 'data/product-master/rows.json'
Require-File 'data/product-master/rows.csv'
Require-File 'funnel-build/page-specs/wire-cable-industry-landing-page.md'
Require-File 'funnel-build/page-specs/five-product-families.md'
Require-File 'docs/00-governance/product-taxonomy-governance.md'
Require-File 'data/product-master/taxonomy.json'
Require-File 'data/product-master/taxonomy-migration-manifest.csv'
Require-File 'funnel-build/technical-library/proof-stack.md'
Require-File 'funnel-build/forms-and-routing/adaptive-requirement-form-routing.md'
Require-File 'funnel-build/dashboard-and-reporting/dashboard-reporting-model.md'
Require-File 'activation/monthly-operating-system/README.md'
Require-File 'funnel-build/qa-checklists/final-alignment-audit.md'

$rows = Get-Content -Raw -LiteralPath (Join-Path $root 'data/product-master/rows.json') | ConvertFrom-Json
if ($rows.Count -ne 38) {
    $failures.Add("Expected 38 product rows; found $($rows.Count)")
}

$supportItems = @($rows | Where-Object { $_.'Signed Scope Treatment' -eq 'Covered Support Item' })
if ($supportItems.Count -lt 6) {
    $failures.Add("Expected at least 6 Covered Support Item rows; found $($supportItems.Count)")
}

$heroSupport = @($supportItems | Where-Object { $_.'Sales Priority' -eq 'Hero' })
if ($heroSupport.Count -gt 0) {
    $failures.Add("Support item rows must not be Hero priority: $($heroSupport.'Product / Model Name' -join ', ')")
}

Require-Text 'funnel-build/page-specs/five-product-families.md' 'LTC-PRO Web Tension Controller'
Require-Text 'funnel-build/page-specs/five-product-families.md' 'PF-05'
Require-Text 'funnel-build/forms-and-routing/adaptive-requirement-form-routing.md' 'Service/support'
Require-Text 'funnel-build/dashboard-and-reporting/dashboard-reporting-model.md' '15% to 20%'
Require-Text 'activation/monthly-operating-system/README.md' '20,000 campaign email sends'

$readme = Get-Content -Raw -LiteralPath (Join-Path $root 'README.md')
$checklist = Get-Content -Raw -LiteralPath (Join-Path $root 'funnel-build/qa-checklists/migration-validation.md')
foreach ($bad in @("`funnel-build", "`activation", "`rows", "`notion-source-map")) {
    if ($readme.Contains($bad) -or $checklist.Contains($bad)) {
        $failures.Add("Detected escaped/control-character path residue: $bad")
    }
}

if ($failures.Count -gt 0) {
    Write-Host 'Workspace validation failed:'
    $failures | ForEach-Object { Write-Host "- $_" }
    exit 1
}

Write-Host 'Workspace validation passed.'
