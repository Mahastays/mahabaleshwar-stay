$source = "d:\STUDY MATERIAL\MAHABLESHWAR STAY\backend"
$destination = "d:\STUDY MATERIAL\MAHABLESHWAR STAY\backend-deploy-v4.zip"
$exclude = @('node_modules', '.env', 'package-lock.json')

Add-Type -Assembly 'System.IO.Compression'
Add-Type -Assembly 'System.IO.Compression.FileSystem'

if (Test-Path $destination) { Remove-Item $destination }

$zip = [System.IO.Compression.ZipFile]::Open($destination, 'Create')

$files = Get-ChildItem -Path $source -Recurse -File | Where-Object {
    $relativePath = $_.FullName.Substring($source.Length + 1)
    $firstPart = $relativePath.Split('\')[0]
    -not ($exclude -contains $firstPart)
}

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($source.Length + 1)
    # Convert backslashes to forward slashes for Linux compatibility
    $entryName = $relativePath.Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $entryName) | Out-Null
}

$zip.Dispose()
Write-Host "Created $destination with forward-slash paths successfully!"
