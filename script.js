/* script.js */

// [핵심] 브라우저 뒤로가기 처리를 위한 이벤트 리스너
window.addEventListener('popstate', function(event) {
    if (!event.state || event.state.view !== 'detail') {
        document.getElementById('detail-view-area').style.display = 'none';
        document.getElementById('main-content-area').style.display = 'block';
        window.scrollTo({ top: 350, behavior: 'smooth' });
    }
});

function viewDetail(no) {
    const mainArea = document.getElementById('main-content-area');
    const detailArea = document.getElementById('detail-view-area');
    const contentBody = document.getElementById('detail-content-body');
    const overlay = document.getElementById('loading-overlay');

    overlay.style.display = 'flex';

    history.pushState({ view: 'detail', no: no }, '', '?no=' + no);

    // API 서버 주소로 변경 필수
    fetch('https://100479.net/blog2/view.php?no=' + no)
    .then(res => res.text())
    .then(html => {
        contentBody.innerHTML = html;
        mainArea.style.display = 'none';
        detailArea.style.display = 'block';
        overlay.style.display = 'none';
        window.scrollTo({ top: 100, behavior: 'smooth' });
    })
    .catch(err => { console.error(err); overlay.style.display = 'none'; });
}

function searchTag(tagName, element) {
    document.getElementById('searchKeywordInput').value = tagName; 
    document.querySelectorAll('.tag-badge').forEach(tag => tag.classList.remove('active'));
    if(element) element.classList.add('active');
    loadData(1); 
}

function loadData(page = 1) {
    const overlay = document.getElementById('loading-overlay');
    const resultArea = document.getElementById('ajax-result-area');
    const form = document.getElementById('ajaxSearchForm');
    overlay.style.display = 'flex';
    
    const formData = new FormData(form);
    formData.append('action', 'fetch');
    formData.append('page', page);
    
    if(document.getElementById('reg_all').checked) { formData.append('region[]', '전체'); }

    // API 서버 주소로 변경 필수 (현재 도메인과 다를 경우 전체 URL 입력)
    fetch('https://100479.net/blog2/index.php', { method: 'POST', body: formData })
    .then(res => res.text())
    .then(html => {
        resultArea.innerHTML = html;
        overlay.style.display = 'none';
        window.scrollTo({ top: 350, behavior: 'smooth' });
    })
    .catch(err => { console.error(err); overlay.style.display = 'none'; });
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const detailNo = urlParams.get('no');
    if (detailNo) { viewDetail(detailNo); }
};

// 이벤트 바인딩 (DOM 로드 후 실행되도록 보장)
document.addEventListener('DOMContentLoaded', function() {
    const regAll = document.getElementById('reg_all');
    if(regAll) {
        regAll.addEventListener('change', function() {
            const isChecked = this.checked;
            document.querySelectorAll('.region-checkbox').forEach(cb => { cb.checked = isChecked; });
        });
    }
    
    const searchForm = document.getElementById('ajaxSearchForm');
    if(searchForm) {
        searchForm.addEventListener('submit', (e) => { e.preventDefault(); loadData(1); });
    }

});

