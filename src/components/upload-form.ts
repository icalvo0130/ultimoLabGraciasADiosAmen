class UploadForm extends HTMLElement {
    private input!: HTMLInputElement;
    private list!: HTMLDivElement;

    constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    connectedCallback(){
        this.render();
    }

    private async handleFiles(files: FileList){
        const entries = Array.from(files);
        for(const file of entries){
            const item = document.createElement('div');
            item.textContent = `Uploading ${file.name}`;
            this.list.appendChild(item);
            try{
                // progress placeholder
                const url = await import('../services/supabase').then(m=>m.uploadMeme(file, ()=>{}));
                item.textContent = `${file.name} uploaded`;
            }catch(e){
                item.textContent = `Error uploading ${file.name}`;
            }
        }
        this.input.value='';
    }

    render(){
        if(!this.shadowRoot) return;
        this.shadowRoot.innerHTML = `
            <style>
                :host{display:block;margin-bottom:1rem;}
            </style>
            <input type="file" multiple accept="image/*,video/*" />
            <div class="list"></div>
        `;
        this.input = this.shadowRoot.querySelector('input') as HTMLInputElement;
        this.list = this.shadowRoot.querySelector('.list') as HTMLDivElement;
        this.input.addEventListener('change', e=>{
            const files = this.input.files;
            if(files) this.handleFiles(files);
        });
    }
}

customElements.define('upload-form', UploadForm);
export default UploadForm;
