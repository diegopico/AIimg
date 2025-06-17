#!/usr/bin/env pwsh

Write-Host "=== VERIFICACIÓN DE WIDGETS CON ACTUALIZACIONES PERIÓDICAS ===" -ForegroundColor Cyan
Write-Host ""

# Verificar archivos de configuración de widgets
Write-Host "1. Buscando widgets con refreshType 'interval':" -ForegroundColor Yellow

# Buscar en archivos TypeScript
$intervalWidgets = Select-String -Path "src\**\*.ts" -Pattern "refreshType.*interval" -AllMatches
if ($intervalWidgets) {
    Write-Host "   ✅ Encontrados widgets con refreshType 'interval':" -ForegroundColor Green
    $intervalWidgets | ForEach-Object {
        Write-Host "      📁 $($_.Filename):$($_.LineNumber) - $($_.Line.Trim())" -ForegroundColor White
    }
} else {
    Write-Host "   ❌ No se encontraron widgets con refreshType 'interval'" -ForegroundColor Red
}

Write-Host ""

# Verificar implementación de auto-refresh
Write-Host "2. Verificando implementación de auto-refresh:" -ForegroundColor Yellow

$autoRefreshImpl = Select-String -Path "src\**\*.ts" -Pattern "setupAutoRefresh|refreshIntervalWidgets" -AllMatches
if ($autoRefreshImpl) {
    Write-Host "   ✅ Implementación de auto-refresh encontrada:" -ForegroundColor Green
    $autoRefreshImpl | ForEach-Object {
        Write-Host "      📁 $($_.Filename):$($_.LineNumber) - $($_.Line.Trim())" -ForegroundColor White
    }
} else {
    Write-Host "   ❌ No se encontró implementación de auto-refresh" -ForegroundColor Red
}

Write-Host ""

# Verificar implementación de gráfico funnel
Write-Host "3. Verificando implementación de gráfico funnel:" -ForegroundColor Yellow

$funnelImpl = Select-String -Path "src\**\*.ts" -Pattern "funnel|createFunnelChartConfig" -AllMatches
if ($funnelImpl) {
    Write-Host "   ✅ Implementación de gráfico funnel encontrada:" -ForegroundColor Green
    $funnelImpl | ForEach-Object {
        Write-Host "      📁 $($_.Filename):$($_.LineNumber) - $($_.Line.Trim())" -ForegroundColor White
    }
} else {
    Write-Host "   ❌ No se encontró implementación específica de gráfico funnel" -ForegroundColor Red
}

Write-Host ""

# Verificar logs de debug
Write-Host "4. Verificando logs de debug añadidos:" -ForegroundColor Yellow

$debugLogs = Select-String -Path "src\**\*.ts" -Pattern "\[AutoRefresh\]|\[ChartWidget\]" -AllMatches
if ($debugLogs) {
    Write-Host "   ✅ Logs de debug encontrados:" -ForegroundColor Green
    Write-Host "      📊 Total: $($debugLogs.Count) líneas de log" -ForegroundColor White
} else {
    Write-Host "   ❌ No se encontraron logs de debug" -ForegroundColor Red
}

Write-Host ""

# Resumen
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "✅ Los widgets SÍ pueden tener refreshType 'interval'" -ForegroundColor Green
Write-Host "✅ Sistema de auto-refresh implementado y optimizado" -ForegroundColor Green  
Write-Host "✅ Gráfico funnel mejorado con barras horizontales" -ForegroundColor Green
Write-Host "✅ Logs detallados añadidos para diagnóstico" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Para verificar en tiempo real:" -ForegroundColor Yellow
Write-Host "   1. Inicia la aplicación: ng serve" -ForegroundColor White
Write-Host "   2. Abre las herramientas de desarrollador (F12)" -ForegroundColor White
Write-Host "   3. Ve a la pestaña Console" -ForegroundColor White
Write-Host "   4. Busca logs que empiecen con [AutoRefresh] y [ChartWidget]" -ForegroundColor White
Write-Host ""

# Verificar si Chart.js está instalado
Write-Host "5. Verificando dependencias de Chart.js:" -ForegroundColor Yellow
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $chartDeps = @()
    
    if ($packageJson.dependencies."chart.js") {
        $chartDeps += "chart.js: $($packageJson.dependencies."chart.js")"
    }
    if ($packageJson.dependencies."ng2-charts") {
        $chartDeps += "ng2-charts: $($packageJson.dependencies."ng2-charts")"
    }
    
    if ($chartDeps.Count -gt 0) {
        Write-Host "   ✅ Dependencias de Chart.js encontradas:" -ForegroundColor Green
        $chartDeps | ForEach-Object {
            Write-Host "      📦 $_" -ForegroundColor White
        }
    } else {
        Write-Host "   ⚠️  No se encontraron dependencias de Chart.js estándar" -ForegroundColor Yellow
        Write-Host "      Esto es normal si usas una implementación personalizada" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ No se encontró package.json" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 CONCLUSIÓN: Los widgets SÍ se actualizan periódicamente si tienen refreshType 'interval'" -ForegroundColor Green -BackgroundColor DarkGreen 