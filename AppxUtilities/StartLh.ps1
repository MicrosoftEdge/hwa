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
Push-Location
Set-Location 'HKCU:\Software\Classes\Local Settings\Software\Microsoft\Windows\CurrentVersion\AppContainer\Mappings'
$apps = ls
$list = $apps | ForEach-Object {Get-ItemProperty $_.pspath}
$list | ForEach-Object {if ($_.Moniker -eq $pfn) { $sid=$_.PSChildName}}
Write-Host $sid
Pop-Location
iex "CheckNetIsolation loopbackexempt -a -p=$($sid)"
$result | .\AppxUtilities\Launch-AppxPackage.ps1
