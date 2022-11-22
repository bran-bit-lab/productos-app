class ExportComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        fetch('components/export/export-component.html')
            .then( response => response.text() )
            .then( html => {
                this.innerHTML = html;
                this.render();
            })
            .catch( error => {
                console.error( error );
            });
    }

    render() {
        const exportColumn = this.querySelector('.export-column');

        if ( exportColumn ) {
            exportColumn.addEventListener('click', () => {
                this.send('export-file');
            });
        }

        const importColumn = this.querySelector('.import-column');

        if ( importColumn ) {
            importColumn.addEventListener('click', () => {
                this.send('import-file');
            });
        }
    }

    send( nameEvent = 'import-file' ) {

        const event = new CustomEvent('export-data', {
            cancelable: true,
            bubbles: true,
            detail: {
                nameEvent
            }
        });

        this.dispatchEvent( event );
    }
}

customElements.define('app-export', ExportComponent);