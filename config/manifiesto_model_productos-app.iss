[Setup]
AppName=Productos-App
DefaultDirName={autopf}\Productos-App
AppVersion=1.0
AppPublisher=bran-bit-lab & gabmart1995.
DisableDirPage=no
DisableWelcomePage=no
; anadir el image setup

[Files]
Source: ":path"; DestDir: "{app}"; Flags: "recursesubdirs"
