const head = `<style>
    .Markplus-catalog {
        position: relative;
        margin-right: 10px;
        transition: margin-right 0.5s;
    }
    .Markplus-catalog.fold {
        margin-right: 50px;
    }

    .Markplus-catalog>a.fold {
        position: absolute;
        top: 0;
        z-index: 1;
        right: 10px;
        margin-top: 10px;
        cursor: pointer;
        color: #fff;
        transition: top 0.5s, color 0.5s 0.5s;
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
    .Markplus-catalog>.Tabel span.tab:not(:hover) {
        color: #9ff;
    }
    .Markplus-catalog>.Tabel span.tab:hover {
        border-left: 3px solid #fff;
        padding-left: 5px;
    }
    .Markplus-catalog>.Tabel span.tab-1 { text-decoration: underline; font-weight: bold; margin-top: 30px; margin-bottom: 20px; }
    ${new Array(4).fill().map((_, index) => `.Markplus-catalog>.Tabel span.tab-${2 + index} { margin-left: ${12 + 10 * index}px; }`).join('\n    ')}
</style><style id="markplusCatalogDynamicStyle"></style>`;

const RenderCatalog = (self, fold) => ({
    head: () => head,
    code: () => `(container => {
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

        window.addEventListener('load', () => ((parent) => {
            parent.style.display = 'flex';
            parent.insertBefore(container, Markplus.container);
        })(Markplus.container.parentElement));

        const dynamicStyle = document.querySelector('#markplusCatalogDynamicStyle');
        ['load', 'hashchange'].forEach(event => window.addEventListener(event, () => {
            const firstTab = container.querySelector('.Tabel span.tab');
            const hash = decodeURIComponent(location.hash || firstTab && firstTab.getAttribute('to'));
            dynamicStyle.innerHTML = \`.Markplus-catalog>.Tabel span.tab[to="\${hash}"] { color: #fff; }\`;
            const hashTag = Markplus.container.querySelector(\`.Header\${hash}\`);
            const styleTop = () => Math.min(hashTag.offsetTop - hashTag.offsetParent.offsetTop, container.clientHeight - tabArea.clientHeight);
            hashTag && (tabArea.style.top = foldButton.style.top = \`\${styleTop()}px\`);
        }));

        Markplus.catalog = /** @param {HTMLElement} ele */ ele => {
            if (!ele) {
                return container;
            }
            const tab = document.createElement('span');
            tab.innerText = ele.innerText;
            tab.classList.add('tab');
            tab.classList.add(\`tab-\${ele.getAttribute('data-markplus-header-level')}\`);
            tab.setAttribute('to', \`#\${ele.id}\`);
            tab.addEventListener('click', () => location.hash = ele.id)
            tabArea.appendChild(tab);
        };
        Markplus.decorators.push(ele => ele.classList.contains('Header') && Markplus.catalog(ele));

        return container;
    })(document.createElement('div'));
`,
});
exports.default = RenderCatalog;
