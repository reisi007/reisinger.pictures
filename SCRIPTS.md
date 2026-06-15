````shell Alle Basisnamen der JPEG eines bestimmten Ordners als String JSON array
powershell -Command "(Get-ChildItem *.jpg).BaseName | ConvertTo-Json"
````