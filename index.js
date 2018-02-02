const head = `<style>
    .Markplus-catalog {
        position: relative;
    }

    .Markplus-catalog>a.fold {
        position: absolute;
        z-index: 1;
        top: 0;
        right: 10px;
        margin-top: 10px;
        cursor: pointer;
        transition: top 0.5s, color 0.5s;
    }
    .Markplus-catalog:not(.fold)>a.fold {
        color: #fff;
    }
    .Markplus-catalog.fold>a.fold {
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
        transition: top 0.5s, width 0.5s, max-height 0.5s;
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
        z-index: 1;
        bottom: 0;
        width: 30vw;
        transition: top 0.5s, width 0.5s;
        display: block;
        text-align: center;
        cursor: pointer;
        background: #6cf;
        background: linear-gradient(0, #6cf, rgba(255, 255, 255, 0));
    }
    .Markplus-catalog:not(.fold)>span.top {
        color: #fff;
    }
    .Markplus-catalog.fold>span.top {
        width: 0vw;
    }
</style><style id="markplusCatalogDynamicStyleTab"></style><style id="markplusCatalogDynamicStyleVertical"></style>`;

const RenderCatalog = (self, fold, ) => ({
    head: () => head,
    code: () => `(cache => Markplus.process.push(mpContainer => {
        const container = document.createElement('div');
        (parent => {
            if (window.innerWidth / window.innerHeight > 1) {
                parent.style.display = 'flex';
            } else {
                document.querySelector('#markplusCatalogDynamicStyleVertical').innerHTML = \`
                    .Markplus-catalog>.Tabel, .Markplus-catalog>span.top { width: 100%; }
                    .Markplus-catalog>.Tabel { max-height: 1000vh; }
                    .Markplus-catalog.fold>.Tabel { width: 100%; max-height: 0vh; }
                \`;
            }
            parent.insertBefore(container, mpContainer);
        })(mpContainer.parentElement);

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
            const offsetTop = (target, pt = 0) => target.offsetParent ? offsetTop(target.offsetParent, pt + target.offsetTop) : pt + target.offsetTop;
            const styleTop = () => Math.min(offsetTop(target) - offsetTop(container), container.clientHeight - tabArea.clientHeight);
            target && [tabArea, foldButton].forEach(dom => dom.style.top = \`\${styleTop()}px\`);
        };
        cache.scrollToTop.push(() => scrollTo(mpContainer));

        const backTop = document.createElement('span');
        container.appendChild((button => {
            button.innerText = '︽';
            button.classList.add('top');
            button.addEventListener('click', () => {
                location.hash = location.hash ? '' : '#top';
                cache.scrollToTop.forEach(scroll => scroll());
            });
            return button;
        })(backTop));

        const hashAvailable = () => location.hash.slice(1) && location.hash != '#top';
        const dynamicStyle = document.querySelector('#markplusCatalogDynamicStyleTab');
        ['load', 'hashchange'].forEach(event => window.addEventListener(event, () => {
            const firstTab = container.querySelector('.Tabel span.tab');
            const hash = decodeURIComponent(hashAvailable() ? location.hash : firstTab && firstTab.getAttribute('to'));
            dynamicStyle.innerHTML = \`.Markplus-catalog>.Tabel span.tab[to="\${hash}"] { color: #fff; }\`;
            hashAvailable() && scrollTo(mpContainer.querySelector(\`.Header\${hash}\`) || mpContainer.querySelector(hash));
        }));

        const catalog = /** @param {HTMLElement} ele */ ele => {
            if (!ele) {
                return;
            }
            Array.prototype.forEach.call(ele.querySelectorAll(':not(.hash)'), child => child.addEventListener('click', () => scrollTo(ele)));

            if (!ele.parentElement == mpContainer ) {
                return;
            }

            const tab = document.createElement('span');
            tab.innerText = ele.innerText;
            tab.classList.add('tab');
            tab.classList.add(\`tab-\${ele.getAttribute('data-markplus-header-level')}\`);
            tab.setAttribute('to', \`#\${ele.id}\`);
            tab.addEventListener('click', () => location.hash = ele.id);
            tabArea.appendChild(tab);
        };
        Markplus.decorators.push(ele => ele.classList.contains('Header') && catalog(ele));
    }))({ scrollToTop: [] });`.replace(/\n {4}/g, '\n'),
});
exports.default = RenderCatalog;
