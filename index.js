const head = `<style>
    .Markplus-catalog {
        position: relative;
        transition: margin-right 0.5s;
    }

    .Markplus-catalog>a.fold {
        position: absolute;
        top: 0;
        z-index: 1;
        right: 10px;
        margin-top: 10px;
        cursor: pointer;
        color: #fff;
        transition: top 0.5s, color 0.5s;
    }
    .Markplus-catalog.fold>a.fold {
        color: unset;
        left: 10px;
    }
    .Markplus-catalog>a.fold::before {
        content: "◥";
    }

    .Markplus-catalog>.Tabel {
        position: relative;
        top: 0;
        background: #6cf;
        width: 30vw;
        transition: top 0.5s, width 0.5s;
        overflow: hidden;
        color: #fff;
    }
    .Markplus-catalog.fold>.Tabel {
        width: 0vw;
    }

    .Markplus-catalog>.Tabel>* {
        display: block;
        margin: 10px 30px 10px 12px;
        padding-left: 8px;
    }
    .Markplus-catalog>.Tabel span {
        word-break: break-all;
    }
    .Markplus-catalog>.Tabel span.tab-1 {
        word-break: break-word;
    }
    .Markplus-catalog>.Tabel span.tab:not(:hover) {
        color: #9ff;
    }
    .Markplus-catalog>.Tabel span.tab:hover:not(.tab-1) {
        border-left: 3px solid #fff;
        padding-left: 5px;
    }
    .Markplus-catalog>.Tabel span.tab-1 {
        text-decoration: underline;
        font-weight: bold;
        margin-top: 30px;
        margin-bottom: 20px;
        text-align: center;
        border: 1px solid;
        padding: 3px;
    }
    .Markplus-catalog>.Tabel span.tab-2 { border-top: 1px solid; border-bottom: 1px dashed; margin-top: 20px; }
    ${new Array(4).fill().map((_, index) => `.Markplus-catalog>.Tabel span.tab-${2 + index} { margin-left: ${12 + 15 * index}px; }`).join('\n    ')}
    
    .Markplus-catalog>span.top {
        position: fixed;
        bottom: 0;
        width: 30vw;
        transition: top 0.5s, width 0.5s;
        display: block;
        text-align: center;
        cursor: pointer;
        background: linear-gradient(0, #6cf, rgba(0, 0, 0, 0));
        color: #9ff;
    }
    .Markplus-catalog.fold>span.top {
        width: 0vw;
    }
    .Markplus-catalog>span.top:hover {
        color: #fff;
    }
    .Markplus-catalog.fold>span.top:hover {
        color: #6cf;
    }
</style><style id="markplusCatalogDynamicStyle"></style>`;

const RenderCatalog = (self, fold) => ({
    head: () => head,
    code: () => `(container => {
        window.addEventListener('load', () => ((parent) => {
            parent.style.display = 'flex';
            parent.insertBefore(container, Markplus.container);
        })(Markplus.container.parentElement));

        container.classList.add('Markplus-catalog');
        container.appendChild((span => (span.innerHTML = '<!-- markplus-plugin-render-catalog -->', span))(document.createElement('span')));

        const foldButton = document.createElement('a');
        container.appendChild((button => {
            button.classList.add('fold');
            button.addEventListener('click', () => container.classList[container.classList.contains('fold') ? 'remove' : 'add']('fold'));
            ${fold ? 'container.classList.add(\'fold\');' : ''}
            return button;
        })(foldButton));

        const tabArea = document.createElement('div');
        tabArea.classList.add('Tabel');
        container.appendChild(tabArea);

        const scrollTo = target => {
            const styleTop = () => Math.min(target.offsetTop - target.offsetParent.offsetTop, container.clientHeight - tabArea.clientHeight);
            target && target.offsetParent && [tabArea, foldButton].forEach(dom => dom.style.top = \`\${styleTop()}px\`);
        }

        const backTop = document.createElement('span');
        container.appendChild((button => {
            button.innerText = '︽';
            button.classList.add('top');
            button.addEventListener('click', () => {
                location.hash = location.hash ? '' : '#top';
                scrollTo(Markplus.container);
            });
            ${fold ? 'container.classList.add(\'fold\');' : ''}
            return button;
        })(backTop));

        const hashAvailable = () => location.hash && location.hash != '#top';
        const dynamicStyle = document.querySelector('#markplusCatalogDynamicStyle');
        ['load', 'hashchange'].forEach(event => window.addEventListener(event, () => {
            const firstTab = container.querySelector('.Tabel span.tab');
            const hash = decodeURIComponent(hashAvailable() ? location.hash : firstTab && firstTab.getAttribute('to'));
            console.log(hash);
            dynamicStyle.innerHTML = \`.Markplus-catalog>.Tabel span.tab[to="\${hash}"] { color: #fff; }\`;
            hashAvailable() && scrollTo(Markplus.container.querySelector(\`.Header\${hash}\`) || Markplus.container.querySelector(hash) || document.querySelector(hash));
        }));

        const catalog = /** @param {HTMLElement} ele */ ele => {
            if (!ele) {
                return container;
            }
            ele.addEventListener('click', () => scrollTo(ele));

            const tab = document.createElement('span');
            tab.innerText = ele.innerText;
            tab.classList.add('tab');
            tab.classList.add(\`tab-\${ele.getAttribute('data-markplus-header-level')}\`);
            tab.setAttribute('to', \`#\${ele.id}\`);
            tab.addEventListener('click', () => location.hash = ele.id);
            tabArea.appendChild(tab);
        };
        Markplus.decorators.push(ele => ele.classList.contains('Header') && catalog(ele));

        return container;
    })(document.createElement('div'));
`,
});
exports.default = RenderCatalog;
