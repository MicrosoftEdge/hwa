$ErrorActionPreference = "Stop"

$cwd = $args[0]
$guid = $args[1]
$appxmanifest = $args[2]
Write-Host $guid
cd $cwd
$installed = .\AppxUtilities\Get-AppxPackageExt.ps1 $guid
if ($installed) { Remove-AppxPackage $installed.PackageFullName }
$result = .\AppxUtilities\Add-AppxPackageExt.ps1 $appxmanifest
$pfn = $result.Package.PackageFamilyName
$result | .\AppxUtilities\Launch-AppxPackage.ps1
