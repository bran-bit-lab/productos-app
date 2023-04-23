; OnNote Setup
[Setup]
AppName=OnNote Sofware
DefaultDirName={autopf}\OnNote
AppVersion=1.0
AppPublisher=Bran-bit-lab & Gabmart1995.
DisableDirPage=no
DisableWelcomePage=no
WizardImageFile="C:\Users\Brandon\Desktop\productos-app\config\icons\on-note410x798.bmp"

[Icons]
Name: "{commondesktop}\OnNote" ; FileName: "{app}\on-note.EXE" ; IconFilename: "{app}\resources\app\src\icons\on-note65x65.ico"

[Languages]
Name: "es"; MessagesFile: "compiler:Languages\Spanish.isl";
Name: "en"; MessagesFile: "compiler:Default.isl";

[Files]
Source: "C:\Users\Brandon\Desktop\productos-app\out\on-note-win32-ia32\*"; DestDir: "{app}"; Flags: "recursesubdirs"