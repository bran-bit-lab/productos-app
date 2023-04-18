; OnNote Setup
[Setup]
AppName=OnNote Sofware
DefaultDirName={autopf}\OnNote
AppVersion=1.0
AppPublisher=Bran-bit-lab & Gabmart1995.
DisableDirPage=no
DisableWelcomePage=no
WizardImageFile="C:\cygwin64\home\Gabriel Martinez\proyectos\productos-app\config\icons\on-note129x129.bmp"

[Languages]
Name: "es"; MessagesFile: "compiler:Languages\Spanish.isl";
Name: "en"; MessagesFile: "compiler:Default.isl";

;[Icons] desktop icons
;Name: "{commondesktop}\on-note"; IconFilename: "C:\cygwin64\home\Gabriel Martinez\proyectos\productos-app\src\icons\on-note65x65.ico"; \
;  Filename: "{app}\on-note.exe"; 

[Files]
Source: "C:\cygwin64\home\Gabriel Martinez\proyectos\productos-app\out\on-note-win32-x64\*"; DestDir: "{app}"; Flags: "recursesubdirs"