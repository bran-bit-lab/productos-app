#define MyAppName "Productos-app"
#define MyAppVersion "1.0"
#define MyAppPublisher "bran-bit-lab & gabmart1995"

; prueba de creacion de executable de productos app
[Setup]
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={sd}\{#MyAppName}

; flag que siempre muestra la pagina de inicio 
; el direcotrio donde se almacena los datos
DisableWelcomePage=no
DisableDirPage=no

[Files]
Source: "C:\Users\virtualbox\Desktop\productos-app\out\productos-app-win32-ia32\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs
