[Setup]
AppName=OnNote Sofware
DefaultDirName={autopf}\OnNote
AppVersion=1.0
AppPublisher=bran-bit-lab & gabmart1995.
DisableDirPage=no
DisableWelcomePage=no
; anadir el image setup

[Languages]
Name: "es"; MessagesFile: "compiler:Languages\Spanish.isl"

[Files]
Source: "C:\cygwin64\home\Gabriel Martinez\proyectos\productos-app\out\on-note-win32-ia32\*"; DestDir: "{app}"; Flags: "recursesubdirs"