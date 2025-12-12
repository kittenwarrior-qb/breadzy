# Script to create backdated commits
# This will create ~100 commits spread over the past year (excluding last 2 months)

$startDate = (Get-Date).AddMonths(-12)  # 1 year ago
$endDate = (Get-Date).AddMonths(-2)     # 2 months ago
$numCommits = 100

# Common commit messages for a web development project
$commitMessages = @(
    "Update dependencies",
    "Fix typo in comments",
    "Refactor code structure",
    "Add error handling",
    "Improve performance",
    "Update documentation",
    "Fix bug in validation",
    "Add logging",
    "Clean up code",
    "Update configuration",
    "Optimize queries",
    "Fix security issue",
    "Add unit tests",
    "Update API endpoints",
    "Improve error messages",
    "Refactor service layer",
    "Update database schema",
    "Add new feature",
    "Fix edge case",
    "Improve code readability",
    "Update environment variables",
    "Fix memory leak",
    "Add input validation",
    "Update UI components",
    "Improve API response",
    "Fix authentication bug",
    "Add caching layer",
    "Update middleware",
    "Improve database performance",
    "Fix CORS issue",
    "Add rate limiting",
    "Update error handling",
    "Improve logging system",
    "Fix routing issue",
    "Add new endpoint",
    "Update dependencies to latest",
    "Fix TypeScript errors",
    "Improve type definitions",
    "Add interface definitions",
    "Update service configuration",
    "Fix async/await issues",
    "Improve promise handling",
    "Add try-catch blocks",
    "Update controller logic",
    "Fix database connection",
    "Improve query efficiency",
    "Add indexes to database",
    "Update entity relationships",
    "Fix migration issues",
    "Add new migration",
    "Update seed data",
    "Fix validation rules",
    "Improve DTO structure",
    "Add new DTO",
    "Update request validation",
    "Fix response formatting",
    "Improve API documentation",
    "Add Swagger annotations",
    "Update README",
    "Fix environment setup",
    "Improve Docker configuration",
    "Add docker-compose updates",
    "Update nginx config",
    "Fix deployment script",
    "Improve CI/CD pipeline",
    "Add automated tests",
    "Update test coverage",
    "Fix failing tests",
    "Improve test structure",
    "Add integration tests",
    "Update e2e tests",
    "Fix test mocks",
    "Improve test data",
    "Add test utilities",
    "Update package.json",
    "Fix npm scripts",
    "Improve build process",
    "Add build optimization",
    "Update webpack config",
    "Fix production build",
    "Improve development setup",
    "Add hot reload",
    "Update ESLint rules",
    "Fix linting errors",
    "Improve code formatting",
    "Add Prettier config",
    "Update Git ignore",
    "Fix merge conflicts",
    "Improve branch strategy",
    "Add code comments",
    "Update inline documentation",
    "Fix JSDoc comments",
    "Improve variable naming",
    "Add constants file",
    "Update utility functions",
    "Fix helper methods",
    "Improve code organization",
    "Add new module",
    "Update module structure",
    "Fix circular dependencies",
    "Improve import statements"
)

# Files to modify (will create if they don't exist)
$filesToModify = @(
    "be\src\utils\helper.ts",
    "be\src\config\constants.ts",
    "fe\src\utils\formatter.ts",
    "fe\src\components\common.tsx",
    "README.md",
    ".gitignore",
    "be\package.json",
    "fe\package.json"
)

Write-Host "Creating $numCommits commits from $startDate to $endDate..." -ForegroundColor Green

for ($i = 0; $i -lt $numCommits; $i++) {
    # Generate random date between start and end
    $randomDays = Get-Random -Minimum 0 -Maximum (($endDate - $startDate).Days)
    $randomHours = Get-Random -Minimum 0 -Maximum 24
    $randomMinutes = Get-Random -Minimum 0 -Maximum 60
    $commitDate = $startDate.AddDays($randomDays).AddHours($randomHours).AddMinutes($randomMinutes)
    
    # Pick a random file to modify
    $fileToModify = $filesToModify | Get-Random
    
    # Ensure directory exists
    $fileDir = Split-Path -Parent $fileToModify
    if ($fileDir -and !(Test-Path $fileDir)) {
        New-Item -ItemType Directory -Path $fileDir -Force | Out-Null
    }
    
    # Create or modify the file with a small change
    if (Test-Path $fileToModify) {
        # Append a comment
        Add-Content -Path $fileToModify -Value "// Update $i - $(Get-Date -Format 'yyyy-MM-dd')"
    } else {
        # Create new file with initial content
        $extension = [System.IO.Path]::GetExtension($fileToModify)
        if ($extension -eq ".ts" -or $extension -eq ".tsx") {
            Set-Content -Path $fileToModify -Value "// Auto-generated file`n// Update $i - $(Get-Date -Format 'yyyy-MM-dd')"
        } elseif ($extension -eq ".json") {
            Set-Content -Path $fileToModify -Value "{`n  `"version`": `"1.0.$i`"`n}"
        } else {
            Set-Content -Path $fileToModify -Value "# Update $i - $(Get-Date -Format 'yyyy-MM-dd')"
        }
    }
    
    # Stage the file
    git add $fileToModify
    
    # Pick a random commit message
    $commitMsg = $commitMessages | Get-Random
    
    # Create commit with backdated timestamp
    $env:GIT_AUTHOR_DATE = $commitDate.ToString("yyyy-MM-ddTHH:mm:ss")
    $env:GIT_COMMITTER_DATE = $commitDate.ToString("yyyy-MM-ddTHH:mm:ss")
    
    git commit -m $commitMsg --date=$commitDate.ToString("yyyy-MM-ddTHH:mm:ss") | Out-Null
    
    # Progress indicator
    if (($i + 1) % 10 -eq 0) {
        Write-Host "Created $($i + 1)/$numCommits commits..." -ForegroundColor Cyan
    }
}

Write-Host "`nSuccessfully created $numCommits commits!" -ForegroundColor Green
Write-Host "Use 'git log --oneline' to view the commit history" -ForegroundColor Yellow
Write-Host "Use 'git push -f origin main' to force push (WARNING: This will overwrite remote history)" -ForegroundColor Red
