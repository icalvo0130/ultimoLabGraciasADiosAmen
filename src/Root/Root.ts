import { store } from '../flux/Store';

class Root extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        store.load();
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                div {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
            </style>
            <div>
            <custom-element-a></custom-element-a>
            <custom-element-b></custom-element-b>
            <custom-element-c></custom-element-c>
            </div>
        `;
    }
}

export default Root;