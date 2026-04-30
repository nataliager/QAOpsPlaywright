# Curso Playwright

Proyecto de aprendizaje de Playwright cubriendo automatización UI, API testing, BDD con Cucumber, Page Object Model, TypeScript, reportes con Allure y ejecución en la nube con Azure Playwright Service.

---

## Contenido

- [Estructura del proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Instalación local](#instalación-local)
- [Ejecutar tests localmente](#ejecutar-tests-localmente)
- [Reportes](#reportes)
- [Azure Playwright Service](#azure-playwright-service)
  - [Qué es](#qué-es)
  - [Setup en Azure Portal](#setup-en-azure-portal)
  - [Autenticación: Token vs Credentials](#autenticación-token-vs-credentials)
  - [Configuración local para Azure](#configuración-local-para-azure)
  - [Ejecutar tests contra Azure Service](#ejecutar-tests-contra-azure-service)
- [GitHub Actions CI/CD](#github-actions-cicd)
  - [Secrets y Variables necesarios](#secrets-y-variables-necesarios)
  - [Configurar Service Principal](#configurar-service-principal)
  - [Asignar roles RBAC](#asignar-roles-rbac)
  - [Workflow de GitHub Actions](#workflow-de-github-actions)
- [Errores comunes y soluciones](#errores-comunes-y-soluciones)
- [Jenkins (básico)](#jenkins-básico)

---

## Estructura del proyecto

```
curso-playwright/
├── tests/                        # Specs de Playwright
│   ├── UIBasicstest.spec.js      # Elementos UI básicos
│   ├── Locators.spec.js          # Estrategias de localización
│   ├── ClientApp.spec.js         # App cliente (e2e)
│   ├── ClientAppPO.spec.js/.ts   # App cliente con Page Object Model
│   ├── WebAPIPart1.spec.js/.ts   # API testing parte 1
│   ├── WebAPIPart2.spec.js/.ts   # API testing parte 2
│   ├── NetworkTest.spec.js       # Intercepción de red
│   ├── NetworkTest2.spec.js      # Intercepción de red parte 2
│   ├── Calendar.spec.js          # Manejo de calendarios
│   ├── MoreValidations.spec.js   # Validaciones avanzadas + snapshots
│   ├── upload-download.spec.js   # Subida y descarga de archivos
│   └── Task1-4.spec.js           # Tareas prácticas
├── features/                     # BDD con Cucumber
│   ├── clientApp.feature         # Feature file
│   └── steps/                    # Step definitions
├── pageobjects/                  # Page Object Model (JS)
│   ├── LoginPage.js
│   ├── ProductsPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── OrderConfirmationPage.js
│   ├── MyOrdersPage.js
│   └── POManager.js
├── pageobjects_ts/               # Page Object Model (TypeScript)
├── utils/
│   ├── apiutils.js/.ts           # Utilidades para API (login, crear orden)
│   └── test-base.js/.ts          # Fixtures personalizados
├── playwright.config.js          # Configuración principal de Playwright
├── playwright.service.config.js  # Configuración para Azure Playwright Service
└── .github/workflows/
    └── playwright.yml            # Pipeline de CI/CD con GitHub Actions
```

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| Playwright | Framework de automatización |
| TypeScript | Tests con tipado estático |
| Cucumber | BDD (tests en lenguaje natural) |
| Allure | Reportes visuales avanzados |
| Azure Playwright Service | Ejecución en la nube con reportes centralizados |
| GitHub Actions | CI/CD pipeline |
| ExcelJS | Validación de archivos Excel en tests |

---

## Instalación local

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd curso-playwright

# Instalar dependencias
npm install

# Instalar browsers de Playwright
npx playwright install
```

---

## Ejecutar tests localmente

```bash
# Todos los tests
npm test

# Test específico
npx playwright test tests/ClientAppPO.spec.js

# Con UI (headed)
npx playwright test --headed

# Tests de API
npm run test:api

# Tests con Cucumber
npm run test:cucumber

# Solo tests con tag @Web
npm run test:cucumber:web
```

---

## Reportes

### HTML (Playwright nativo)
```bash
npx playwright test
npx playwright show-report
```

### Allure
```bash
# Generar y abrir reporte
npm run allure:report

# O paso a paso:
npm test
npm run allure:generate
npm run allure:open
```

---

## Azure Playwright Service

### Qué es

Azure Playwright Service permite ejecutar tests de Playwright en navegadores remotos en la nube de Microsoft y ver los resultados (capturas, trazas, videos) en el portal de Azure. Útil para:
- Ejecución paralela masiva
- Historial centralizado de test runs
- Ver reportes HTML en el portal sin necesidad de descargar artefactos

### Setup en Azure Portal

1. Crear un **Resource Group** (ej. `TEST`) en la suscripción de Azure
2. Buscar **Azure Playwright Testing** en el marketplace y crear un workspace
3. El workspace creará automáticamente una **Storage Account** asociada (ej. `pwstrgteste95a`)
4. La storage account tendrá un container `playwright-service-reports` donde se suben los reportes

### Autenticación: Token vs Credentials

Hay dos formas de autenticarse con el servicio:

#### Opción A: Access Token (más simple para CI)

1. En Azure Portal → tu workspace de Playwright → **Access management**
2. Seleccionar **Playwright Service Access Token**
3. Generar un token y copiarlo
4. Usarlo como variable de entorno: `PLAYWRIGHT_SERVICE_ACCESS_TOKEN`

> ⚠️ El token tiene fecha de expiración. Hay que regenerarlo periódicamente.

#### Opción B: Service Principal con Entra ID (recomendado para CI corporativo)

Más robusto para CI/CD porque no expira. Requiere crear un Service Principal con los roles correctos (ver sección [Configurar Service Principal](#configurar-service-principal)).

El código en `playwright.service.config.js` soporta ambas:

```js
const credential = process.env.AZURE_CLIENT_ID
  ? new ClientSecretCredential(
      process.env.AZURE_TENANT_ID,
      process.env.AZURE_CLIENT_ID,
      process.env.AZURE_CLIENT_SECRET
    )
  : new DefaultAzureCredential();
```

- Si `AZURE_CLIENT_ID` está definido → usa Service Principal
- Si no → usa `DefaultAzureCredential` (funciona con `az login` en local o Managed Identity en Azure)

### Configuración local para Azure

1. Instalar Azure CLI: https://docs.microsoft.com/cli/azure/install-azure-cli
2. Hacer login:
```bash
az login
```
3. Crear archivo `.env` (no commitear):
```
PLAYWRIGHT_SERVICE_URL=wss://eastus.api.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/browsers
```
4. Obtener la URL en Azure Portal → tu workspace → **Overview** → **Connection string**

### Ejecutar tests contra Azure Service

```bash
# Asegúrate de tener PLAYWRIGHT_SERVICE_URL definido
export PLAYWRIGHT_SERVICE_URL="wss://eastus.api.playwright.microsoft.com/playwrightworkspaces/<id>/browsers"

# Ejecutar con el config del servicio
npx playwright test --config=playwright.service.config.js

# Con múltiples workers paralelos
npx playwright test --config=playwright.service.config.js --workers=4
```

---

## GitHub Actions CI/CD

### Secrets y Variables necesarios

En tu repositorio de GitHub → **Settings → Secrets and variables → Actions**:

**Secrets** (valores sensibles):
| Secret | Descripción |
|---|---|
| `AZURE_CREDENTIALS` | JSON con credenciales del Service Principal (para `azure/login`) |
| `AZURE_CLIENT_ID` | App ID del Service Principal |
| `AZURE_CLIENT_SECRET` | Secret del Service Principal |
| `AZURE_TENANT_ID` | ID del tenant de Azure |
| `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` | Token de acceso de Playwright Service (opcional si usas SP) |

**Variables** (valores no sensibles):
| Variable | Descripción |
|---|---|
| `PLAYWRIGHT_SERVICE_URL` | URL WebSocket del workspace (ej. `wss://eastus.api.playwright.microsoft.com/...`) |

### Configurar Service Principal

```bash
# 1. Crear el Service Principal
az ad sp create-for-rbac \
  --name "github-playwright" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP> \
  --sdk-auth

# El output JSON de este comando va al secret AZURE_CREDENTIALS
```

Obtener el App ID del SP creado:
```bash
az ad sp list --display-name github-playwright --query "[].appId" --output tsv
```

### Asignar roles RBAC

El Service Principal necesita estos 3 roles:

```bash
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
SP_APP_ID="<app-id-del-sp>"

# 1. Contributor en el Resource Group
az role assignment create \
  --assignee "$SP_APP_ID" \
  --role "Contributor" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/TEST"

# 2. Storage Blob Data Contributor en la Storage Account
az role assignment create \
  --assignee "$SP_APP_ID" \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/TEST/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"

# 3. Owner en el workspace de Playwright
az role assignment create \
  --assignee "$SP_APP_ID" \
  --role "Owner" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/TEST/providers/Microsoft.LoadTestService/playwrightWorkspaces/<workspace-name>"
```

> ⚠️ El tipo de recurso correcto es `Microsoft.LoadTestService/playwrightWorkspaces`, NO `Microsoft.AzurePlaywrightService/accounts`.

Verificar roles asignados:
```bash
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
az role assignment list \
  --assignee "<app-id>" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/TEST" \
  --query "[].{Role:roleDefinitionName, Scope:scope}" \
  --output table
```

### Workflow de GitHub Actions

El archivo `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Azure Login
      uses: azure/login@v3
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    - name: Run Playwright tests
      env:
        PLAYWRIGHT_SERVICE_URL: ${{ vars.PLAYWRIGHT_SERVICE_URL }}
        AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
        AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
        AZURE_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
        PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
      run: npx playwright test --config=playwright.service.config.js --workers=1 2>&1
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

> **Importante:** No pasar `--reporter` en el comando porque sobreescribe los reporters del config y el reporte de Azure no se genera.

---

## Errores comunes y soluciones

### `Cannot find module '../utils/apiutils'`
**Causa:** Linux es case-sensitive. El archivo se llama `APIUtils.js` pero el import usa `apiutils`.  
**Solución:** Renombrar el archivo a minúsculas y actualizar los imports:
```bash
git mv utils/APIUtils.js utils/apiutils.js
git mv utils/APIUtils.ts utils/apiutils.ts
```

### `Reporting upload status: FAILED`
**Causa:** El reporter no puede subir el reporte al blob storage.  
**Diagnóstico:** Agregar `AZURE_LOG_LEVEL: verbose` al workflow para ver los detalles.  
**Soluciones posibles:**
- Verificar que el SP tiene el rol `Storage Blob Data Contributor` en la storage account
- Verificar que el SP tiene rol en el workspace de Playwright (tipo `Microsoft.LoadTestService/playwrightWorkspaces`)
- Verificar que la storage account tiene habilitado "Allow storage account key access"

### `Test run creation failed during setup`
**Causa:** El reporter recibió opciones inválidas (ej. pasar `credential` directamente al reporter).  
**Solución:** El reporter `@azure/playwright/reporter` NO acepta opciones. Debe declararse como:
```js
["@azure/playwright/reporter"]  // sin opciones adicionales
```

### `HTTP 404: The specified blob does not exist`
**Causa:** El reporte nunca fue subido al blob storage. El 404 en el portal es una consecuencia.  
**Solución:** Resolver primero el error de `Reporting upload status: FAILED`.

### El proceso termina en ~1 segundo sin correr tests
**Causas posibles:**
1. Error al cargar archivos de test (módulo no encontrado) → revisar imports
2. `--reporter=list` en el comando sobreescribe los reporters del config

### `Subscription not found` al correr comandos de Azure CLI
**Causa:** El subscription ID que usas no coincide con el de tu cuenta activa.  
**Solución:**
```bash
# Ver el subscription ID correcto
az account show --query id --output tsv

# Usarlo como variable para evitar errores de tipeo
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
```

### `ResourceNotFound` para el workspace de Playwright
**Causa:** El tipo de recurso incorrecto.  
**Solución:** Buscar con el tipo correcto:
```bash
az resource list \
  --resource-type "Microsoft.LoadTestService/playwrightWorkspaces" \
  --query "[].{Name:name, ResourceGroup:resourceGroup}" \
  --output table
```

---

## Jenkins (básico)

Jenkins es otra herramienta de CI/CD que puede ejecutar los mismos tests de Playwright.

### Instalación

```bash
# Con Docker (recomendado)
docker run -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts

# O con Java
java -jar jenkins.war --httpPort=8080
```

Acceder en: `http://localhost:8080`

### Jenkinsfile básico

Crear un archivo `Jenkinsfile` en la raíz del proyecto:

```groovy
pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        PLAYWRIGHT_SERVICE_URL = credentials('PLAYWRIGHT_SERVICE_URL')
        PLAYWRIGHT_SERVICE_ACCESS_TOKEN = credentials('PLAYWRIGHT_SERVICE_ACCESS_TOKEN')
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps chromium'
            }
        }

        stage('Test') {
            steps {
                sh 'npx playwright test'
            }
        }

        stage('Report') {
            steps {
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report'
                ])
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}
```

### Configurar credenciales en Jenkins

1. Jenkins → **Manage Jenkins → Credentials → System → Global credentials**
2. Agregar cada secret con el mismo nombre usado en el `Jenkinsfile`

### Ejecutar contra Azure Playwright Service en Jenkins

Para usar Azure Playwright Service desde Jenkins, reemplazar el stage `Test`:

```groovy
stage('Test with Azure') {
    environment {
        AZURE_CLIENT_ID = credentials('AZURE_CLIENT_ID')
        AZURE_CLIENT_SECRET = credentials('AZURE_CLIENT_SECRET')
        AZURE_TENANT_ID = credentials('AZURE_TENANT_ID')
    }
    steps {
        sh 'npx playwright test --config=playwright.service.config.js --workers=4'
    }
}
```

---

## Notas

- Los archivos `.env` y `state.json` no deben commitearse (agregar al `.gitignore`)
- El `playwright.service.config.js` hereda toda la configuración de `playwright.config.js` y solo agrega lo necesario para Azure
- Para correr tests localmente contra Azure, basta con tener `az login` hecho y `PLAYWRIGHT_SERVICE_URL` definido
