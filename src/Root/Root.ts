class Root extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});
    }
    connectedCallback(){
        this.render();
    }

    render(){
        if(!this.shadowRoot) return;
        this.shadowRoot.innerHTML=`
            <upload-form></upload-form>
            <meme-gallery></meme-gallery>
        `;
    }
}

customElements.define('root-element', Root);
export default Root;
