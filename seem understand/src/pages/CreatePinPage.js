import { pinsApi } from '../api/pins.js';

export function CreatePinPage({ onCreated } = {}) {
    const root = document.createElement('div');
    root.className = 'main-content create-pin-page';
    root.hidden = true;

    root.innerHTML = `
        <div class="create-pin-page__inner">
            <div class="create-pin-page__left">
                <div class="create-pin-page__upload" tabindex="0">
                    <input class="create-pin-page__file"
                           type="file"
                           accept="image/*"
                           hidden>

                    <div class="create-pin-page__drop">
                        <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
                            <path d="M18 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0M5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4zm16 4v9h-4.17a5.8 5.8 0 0 1-4.12-1.7l-.24-.24A7.04 7.04 0 0 0 3 11.63V5c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2M3 19v-4.59l.94-.94a5.04 5.04 0 0 1 7.12 0l.23.24A7.8 7.8 0 0 0 16.83 16H21v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2"/>
                        </svg>
                        <div class="create-pin-page__drop-title">拖拽图片到此处</div>
                        <div class="create-pin-page__drop-sub">或点击选择文件 · JPG/PNG 最大 20MB</div>
                    </div>

                    <img class="create-pin-page__preview" alt="" hidden>

                    <button class="create-pin-page__preview-change" type="button" hidden>更换图片</button>
                </div>
            </div>

            <div class="create-pin-page__right">
                <div class="create-pin-page__header">
                    <h1 class="create-pin-page__title">创建 Pin</h1>
                </div>

                <form class="create-pin-page__form" novalidate>
                    <label class="create-pin-page__field">
                        <span class="create-pin-page__label">标题</span>
                        <input class="create-pin-page__input" name="title" type="text" placeholder="告诉大家这张 Pin 是关于什么的">
                    </label>

                    <label class="create-pin-page__field">
                        <span class="create-pin-page__label">描述</span>
                        <textarea class="create-pin-page__textarea" name="description" rows="4" placeholder="描述一下这张 Pin"></textarea>
                    </label>

                    <label class="create-pin-page__field">
                        <span class="create-pin-page__label">链接（可选）</span>
                        <input class="create-pin-page__input" name="link" type="url" placeholder="添加链接">
                    </label>

                    <p class="create-pin-page__error" hidden></p>
                </form>

                <div class="create-pin-page__footer">
                    <button class="create-pin-page__submit" type="button" disabled>保存</button>
                </div>
            </div>
        </div>
    `;

    const uploadEl = root.querySelector('.create-pin-page__upload');
    const fileInput = root.querySelector('.create-pin-page__file');
    const dropEl = root.querySelector('.create-pin-page__drop');
    const previewEl = root.querySelector('.create-pin-page__preview');
    const previewChangeEl = root.querySelector('.create-pin-page__preview-change');
    const formEl = root.querySelector('.create-pin-page__form');
    const errorEl = root.querySelector('.create-pin-page__error');
    const submitEl = root.querySelector('.create-pin-page__submit');

    let selectedFile = null;
    let imgWidth = 0;
    let imgHeight = 0;
    let objectUrl = null;
    let submitting = false;

    function resetForm() {
        selectedFile = null;
        imgWidth = 0;
        imgHeight = 0;
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
            objectUrl = null;
        }
        formEl.reset();
        errorEl.hidden = true;
        previewEl.hidden = true;
        previewEl.removeAttribute('src');
        previewChangeEl.hidden = true;
        dropEl.hidden = false;
        submitEl.disabled = true;
        submitEl.textContent = '保存';
    }

    function handleFile(file) {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            errorEl.textContent = '请选择图片文件';
            errorEl.hidden = false;
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            errorEl.textContent = '图片不能超过 20MB';
            errorEl.hidden = false;
            return;
        }

        selectedFile = file;
        errorEl.hidden = true;

        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = URL.createObjectURL(file);

        const probe = new Image();
        probe.onload = () => {
            imgWidth = probe.naturalWidth;
            imgHeight = probe.naturalHeight;
            previewEl.src = objectUrl;
            previewEl.hidden = false;
            dropEl.hidden = true;
            previewChangeEl.hidden = false;
            submitEl.disabled = false;
        };
        probe.onerror = () => {
            errorEl.textContent = '无法读取图片';
            errorEl.hidden = false;
        };
        probe.src = objectUrl;
    }

    /* ---------- 事件 ---------- */
    uploadEl.addEventListener('click', (e) => {
        if (e.target === previewChangeEl) return;
        fileInput.click();
    });

    previewChangeEl.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFile(e.target.files?.[0]);
        fileInput.value = '';
    });

    /* 拖拽 */
    ['dragenter', 'dragover'].forEach(evt => {
        uploadEl.addEventListener(evt, (e) => {
            e.preventDefault();
            uploadEl.classList.add('is-dragover');
        });
    });
    ['dragleave', 'drop'].forEach(evt => {
        uploadEl.addEventListener(evt, (e) => {
            e.preventDefault();
            uploadEl.classList.remove('is-dragover');
        });
    });
    uploadEl.addEventListener('drop', (e) => {
        const f = e.dataTransfer?.files?.[0];
        if (f) handleFile(f);
    });

    /* 提交 */
    async function submit() {
        if (submitting || !selectedFile) return;

        submitting = true;
        submitEl.disabled = true;
        submitEl.textContent = '上传中…';
        errorEl.hidden = true;

        const fd = new FormData();
        fd.append('image', selectedFile);
        fd.append('width', imgWidth);
        fd.append('height', imgHeight);
        fd.append('title', formEl.elements.title.value.trim());
        fd.append('description', formEl.elements.description.value.trim());
        fd.append('link', formEl.elements.link.value.trim());

        try {
            const { pin } = await pinsApi.create(fd);
            onCreated?.(pin);
        } catch (err) {
            errorEl.textContent = err.message || '上传失败';
            errorEl.hidden = false;
        } finally {
            submitting = false;
            submitEl.textContent = '保存';
            submitEl.disabled = !selectedFile;
        }
    }

    submitEl.addEventListener('click', submit);

    /* 表单回车不让它默认提交 */
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        submit();
    });

    /* ---------- 对外 API ---------- */
    function open() {
        resetForm();
        root.hidden = false;
        window.scrollTo(0, 0);
    }

    function close() {
        root.hidden = true;
        resetForm();
    }

    root.open = open;
    root.close = close;
    return root;
}