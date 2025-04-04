// 登录表单提交处理
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        // 显示加载状态
        const loginBtn = document.querySelector('.login-btn');
        loginBtn.disabled = true;
        loginBtn.textContent = '登录中...';
        
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 登录成功，保存token并跳转
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username);
            window.location.href = 'dashboard.html';
        } else {
            // 显示错误信息
            document.getElementById('errorMessage').textContent = data.message || '登录失败';
        }
    } catch (error) {
        console.error('登录错误:', error);
        document.getElementById('errorMessage').textContent = '登录失败，请检查网络连接';
    } finally {
        // 恢复按钮状态
        const loginBtn = document.querySelector('.login-btn');
        loginBtn.disabled = false;
        loginBtn.textContent = '登录';
    }
});

// 检查登录状态的函数 (在其他页面使用)
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname.split('/').pop();
    
    // 如果在登录页面但已登录，跳转到仪表盘
    if (currentPage === 'login.html' && token) {
        window.location.href = 'dashboard.html';
    }
    
    // 如果在受保护页面但未登录，跳转到登录页
    if (currentPage !== 'login.html' && !token) {
        window.location.href = 'login.html';
    }
    
    return token;
}

// 获取当前用户信息
function getCurrentUser() {
    return {
        username: localStorage.getItem('username'),
        token: localStorage.getItem('authToken')
    };
}

// 登出功能
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}