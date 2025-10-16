/*
  MOOC风格登录弹窗（原生JS）
  用法：
    import '/src/widgets/mooc-login.js'
    window.moocLogin.open()
*/
(function () {
  if (window.moocLogin) return

  const state = {
    open: false,
    tab: 'sms', // sms | email | course
    timer: null,
    countdown: 0,
  }

  const style = `
  :host { all: initial; }
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 999998; }
  .wrap { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 999999; }
  .card { width: 420px; background: #fff; border-radius: 10px; box-shadow: 0 20px 50px rgba(0,0,0,.15); position: relative; font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial; }
  .close { position: absolute; right: 10px; top: 10px; width: 28px; height: 28px; border-radius: 50%; display:flex; align-items:center; justify-content:center; color:#999; cursor:pointer; }
  .close:hover{ background:#f4f4f5; color:#666; }
  .tabs{ display:flex; border-bottom: 1px solid #eee; padding: 18px 24px 0; }
  .tab{ padding: 0 12px 12px; margin-right: 8px; color:#666; cursor:pointer; font-size: 14px; }
  .tab.active{ color:#059669; border-bottom: 2px solid #059669; }
  .body{ padding: 18px 24px 24px; }
  .label{ font-size: 13px; color:#374151; margin-bottom: 6px; }
  .input, .btn-secondary{ height: 44px; padding: 0 12px; width: 100%; border:1px solid #d1d5db; border-radius: 8px; outline: none; }
  .input:focus{ border-color:#10b981; box-shadow: 0 0 0 3px rgba(16,185,129,.15); }
  .row{ margin-bottom: 14px; }
  .grid{ display:grid; grid-template-columns: 1fr auto; gap:10px; }
  .btn{ height: 44px; border-radius: 8px; border:none; color:#fff; background:#10b981; cursor:pointer; width: 100%; font-weight:600; }
  .btn:hover{ background:#059669; }
  .btn-secondary{ color:#059669; background:#fff; border-color:#059669; }
  .hint{ font-size: 12px; color:#6b7280; display:flex; justify-content:space-between }
  .hidden{ display:none !important; }
  `

  const el = document.createElement('div')
  el.style.display = 'none'
  el.innerHTML = `
    <div class="overlay" data-close="1"></div>
    <div class="wrap">
      <div class="card">
        <div class="close" data-close="1">✕</div>
        <div class="tabs">
          <div class="tab active" data-tab="sms">手机登录</div>
          <div class="tab" data-tab="email">邮箱登录</div>
          <div class="tab" data-tab="course">校园账号</div>
        </div>
        <div class="body">
          <form class="form-sms">
            <div class="row">
              <div class="label">手机号</div>
              <input class="input" name="phone" maxlength="11" placeholder="请输入手机号">
            </div>
            <div class="row grid">
              <div>
                <div class="label">验证码</div>
                <input class="input" name="code" placeholder="请输入验证码">
              </div>
              <button type="button" class="btn-secondary" name="getCode">获取验证码</button>
            </div>
            <button class="btn" type="submit">登 录</button>
          </form>

          <form class="form-email hidden">
            <div class="row">
              <div class="label">邮箱</div>
              <input class="input" name="email" placeholder="请输入邮箱">
            </div>
            <div class="row">
              <div class="label">密码</div>
              <input class="input" name="password" type="password" placeholder="请输入密码">
            </div>
            <div class="row hint">
              <label><input type="checkbox" name="remember"> 10天内免登录</label>
              <a href="javascript:void(0)" style="color:#059669">忘记密码?</a>
            </div>
            <button class="btn" type="submit">登 录</button>
          </form>

          <form class="form-course hidden">
            <div class="row">
              <div class="label">校园用户名</div>
              <input class="input" name="user" placeholder="请输入校园用户名">
            </div>
            <div class="row">
              <div class="label">密码</div>
              <input class="input" name="pwd" type="password" placeholder="请输入密码">
            </div>
            <button class="btn" type="submit">登 录</button>
          </form>
        </div>
      </div>
    </div>
  `

  const shadowHost = document.createElement('div')
  shadowHost.style.position = 'fixed'
  shadowHost.style.inset = '0'
  shadowHost.style.zIndex = '2147483647'
  const shadow = shadowHost.attachShadow({ mode: 'open' })
  const styleEl = document.createElement('style')
  styleEl.textContent = style
  shadow.appendChild(styleEl)
  shadow.appendChild(el)

  function switchTab(tab){
    state.tab = tab
    shadow.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t.getAttribute('data-tab')===tab))
    shadow.querySelector('.form-sms').classList.toggle('hidden', tab!=='sms')
    shadow.querySelector('.form-email').classList.toggle('hidden', tab!=='email')
    shadow.querySelector('.form-course').classList.toggle('hidden', tab!=='course')
  }

  function open(){
    if (!shadowHost.isConnected) document.body.appendChild(shadowHost)
    el.style.display = ''
    document.body.style.overflow = 'hidden'
    state.open = true
  }

  function close(){
    el.style.display = 'none'
    document.body.style.overflow = ''
    state.open = false
  }

  function bind(){
    shadow.addEventListener('click', (e)=>{
      const t = e.target
      if (t && t.getAttribute && t.getAttribute('data-close')) close()
      if (t && t.classList && t.classList.contains('tab')) switchTab(t.getAttribute('data-tab'))
    })

    const smsForm = shadow.querySelector('.form-sms')
    const getBtn = smsForm.querySelector('button[name="getCode"]')
    getBtn.addEventListener('click', ()=>{
      const phone = smsForm.querySelector('input[name="phone"]').value.trim()
      if (!/^\d{11}$/.test(phone)) { alert('请输入11位手机号'); return }
      if (state.countdown>0) return
      state.countdown = 60
      getBtn.disabled = true
      getBtn.textContent = `${state.countdown}s`
      state.timer = setInterval(()=>{
        state.countdown--
        getBtn.textContent = state.countdown>0 ? `${state.countdown}s` : '获取验证码'
        if (state.countdown<=0){
          clearInterval(state.timer); state.timer = null; getBtn.disabled = false
        }
      }, 1000)
    })

    smsForm.addEventListener('submit', (e)=>{ e.preventDefault(); close() })
    shadow.querySelector('.form-email').addEventListener('submit', (e)=>{ e.preventDefault(); close() })
    shadow.querySelector('.form-course').addEventListener('submit', (e)=>{ e.preventDefault(); close() })
  }

  bind()
  switchTab('sms')

  window.moocLogin = { open, close, switchTab }
})()
