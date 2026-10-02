# Builds the whole site (wiki + stocks + feedback) and serves it privately on this computer.
#   powershell -ExecutionPolicy Bypass -File scripts\preview.ps1
# Then open http://localhost:8090 . Nothing here goes public.
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
npx quartz build
Copy-Item -Path "extra\*" -Destination public -Recurse -Force
Write-Host "Preview running at http://localhost:8090  (Ctrl+C to stop)"
npx --yes http-server public -p 8090 -c-1
