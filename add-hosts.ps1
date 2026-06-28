# Script para adicionar liligu.local ao hosts
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$entry = "127.0.0.1       liligu.local"

# Verificar se já existe
$content = Get-Content $hostsPath
if ($content -notcontains $entry) {
    Add-Content -Path $hostsPath -Value $entry
    Write-Host "✅ liligu.local adicionado ao hosts"
} else {
    Write-Host "✅ liligu.local já existe no hosts"
}
