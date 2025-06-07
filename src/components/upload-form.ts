import { supabase } from '../utils/supabase';

class UploadForm extends HTMLElement {
    private inputEl: HTMLInputElement | null = null;
    private progressContainer: HTMLElement | null = null;
    private messageEl: HTMLElement | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    private render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 400px;
                    font-family: sans-serif;
                    color: #fff;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                input[type="file"] {
                    padding: 4px;
                    border-radius: 4px;
                    border: 1px solid #b832fa;
                    background: #1a001a;
                    color: #fff;
                }
                button {
                    padding: 8px;
                    border: none;
                    border-radius: 4px;
                    background-color: #b832fa;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                button:hover {
                    background-color: #ff00ff;
                }
                .progress-container {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .file-progress {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .progress {
                    width: 100%;
                    height: 8px;
                    background-color: #333;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .bar {
                    height: 100%;
                    width: 0;
                    background-color: #b832fa;
                    transition: width 0.2s linear;
                }
                .message {
                    color: #ff8080;
                    margin-top: 8px;
                }
            </style>
            <form>
                <input id="fileInput" type="file" multiple accept=".jpg,.png,.mp4" />
                <button type="submit">Upload</button>
                <div class="progress-container"></div>
                <div class="message"></div>
            </form>
        `;

        this.inputEl = this.shadowRoot.querySelector('#fileInput');
        this.progressContainer = this.shadowRoot.querySelector('.progress-container');
        this.messageEl = this.shadowRoot.querySelector('.message');

        const form = this.shadowRoot.querySelector('form');
        form?.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private async handleSubmit(event: Event) {
        event.preventDefault();
        if (!this.inputEl || !this.progressContainer || !this.messageEl) return;
        const files = Array.from(this.inputEl.files ?? []);
        this.progressContainer.innerHTML = '';
        this.messageEl.textContent = '';

        for (const file of files) {
            if (!this.isValidFile(file)) {
                continue;
            }
            const wrapper = document.createElement('div');
            wrapper.classList.add('file-progress');

            const name = document.createElement('span');
            name.textContent = file.name;

            const progress = document.createElement('div');
            progress.classList.add('progress');

            const bar = document.createElement('div');
            bar.classList.add('bar');
            progress.appendChild(bar);

            wrapper.appendChild(name);
            wrapper.appendChild(progress);
            this.progressContainer.appendChild(wrapper);

            const uniqueName = `${Date.now()}-${file.name}`;
            try {
                const { error } = await supabase.storage
                    .from('memes')
                    .upload(uniqueName, file);
                if (error) throw error;

                bar.style.width = '100%';

                const { data } = supabase.storage
                    .from('memes')
                    .getPublicUrl(uniqueName);
                if (data?.publicUrl) {
                    const link = document.createElement('a');
                    link.href = data.publicUrl;
                    link.textContent = 'View';
                    link.target = '_blank';
                    wrapper.appendChild(link);
                }
            } catch (err) {
                console.error(err);
                bar.style.backgroundColor = 'red';
                this.messageEl.textContent = 'Error uploading files';
            }
        }
    }

    private isValidFile(file: File): boolean {
        const allowed = ['image/jpeg', 'image/png', 'video/mp4'];
        return allowed.includes(file.type);
    }
}

customElements.define('upload-form', UploadForm);

export default UploadForm;