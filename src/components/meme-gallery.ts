import { Meme, listMemes } from '../services/supabase';

class MemeGallery extends HTMLElement {
    private container!: HTMLDivElement;
    private select!: HTMLSelectElement;
    private memes: Meme[] = [];

    constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    connectedCallback(){
        this.render();
        this.load();
    }

    private async load(){
        this.memes = await listMemes();
        this.renderMemes();
    }

    private renderMemes(){
        if(!this.shadowRoot) return;
        this.container.innerHTML='';
        let list = [...this.memes];
        if(this.select.value==='random'){
            list = list.sort(()=>Math.random()-0.5);
        }else{
            list = list.sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime());
        }
        for(const meme of list){
            const wrapper = document.createElement('div');
            if(meme.type==='video'){
                const vid = document.createElement('video');
                vid.src = meme.url;
                vid.autoplay = true;
                vid.loop = true;
                vid.muted = true;
                wrapper.appendChild(vid);
            }else{
                const img = document.createElement('img');
                img.src = meme.url;
                wrapper.appendChild(img);
            }
            wrapper.addEventListener('click',()=>{
                this.showModal(meme.url, meme.type);
            });
            this.container.appendChild(wrapper);
        }
    }

    private showModal(url:string,type:'image'|'video'){
        const modal = document.createElement('div');
        modal.className='modal';
        const inner = document.createElement('div');
        if(type==='video'){
            const vid = document.createElement('video');
            vid.src=url; vid.controls = true; vid.autoplay=true;
            inner.appendChild(vid);
        }else{
            const img = document.createElement('img');
            img.src=url; inner.appendChild(img);
        }
        modal.appendChild(inner);
        modal.addEventListener('click',()=>modal.remove());
        this.shadowRoot?.appendChild(modal);
    }

    render(){
        if(!this.shadowRoot) return;
        this.shadowRoot.innerHTML = `
            <style>
                .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;}
                img,video{width:100%;cursor:pointer;}
                .modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;}
                .modal img,.modal video{max-width:90%;max-height:90%;}
            </style>
            <label>Ordenar:
                <select>
                    <option value="date">Fecha</option>
                    <option value="random">Aleatorio</option>
                </select>
            </label>
            <div class="grid"></div>
        `;
        this.select = this.shadowRoot.querySelector('select') as HTMLSelectElement;
        this.container = this.shadowRoot.querySelector('.grid') as HTMLDivElement;
        this.select.addEventListener('change',()=>this.renderMemes());
    }
}

customElements.define('meme-gallery', MemeGallery);
export default MemeGallery;
