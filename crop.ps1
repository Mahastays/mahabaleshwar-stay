Add-Type -AssemblyName System.Drawing
$imgPath = "d:\STUDY MATERIAL\MAHABLESHWAR STAY\frontend\public\logo.png"
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)

$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.A -gt 0 -and ($pixel.R -lt 250 -or $pixel.G -lt 250 -or $pixel.B -lt 250)) {
            if ($x -lt $minX) { $minX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

if ($minX -le $maxX -and $minY -le $maxY) {
    $pad = 10
    $newMinX = [Math]::Max(0, $minX - $pad)
    $newMinY = [Math]::Max(0, $minY - $pad)
    $newMaxX = [Math]::Min($bmp.Width - 1, $maxX + $pad)
    $newMaxY = [Math]::Min($bmp.Height - 1, $maxY + $pad)

    $rect = New-Object System.Drawing.Rectangle($newMinX, $newMinY, ($newMaxX - $newMinX + 1), ($newMaxY - $newMinY + 1))
    $cropped = $bmp.Clone($rect, $bmp.PixelFormat)
    $bmp.Dispose()
    
    $cropped.Save("d:\STUDY MATERIAL\MAHABLESHWAR STAY\frontend\public\logo_cropped.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Host "Cropped successfully"
} else {
    $bmp.Dispose()
    Write-Host "No non-white pixels found"
}
