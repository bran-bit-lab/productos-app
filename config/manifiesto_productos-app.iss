[Setup]
AppName=Productos-App
DefaultDirName={autopf}\Productos-App
AppVersion=1.0
AppPublisher=bran-bit-lab & gabmart1995.
DisableDirPage=no
DisableWelcomePage=no
; anadir el image setup

[Files]
Source: "C:\cygwin64\home\Gabriel Martinez\proyectos\productos-app\out\productos-app-win32-ia32\*"; DestDir: "{app}"; Flags: "recursesubdirs"
