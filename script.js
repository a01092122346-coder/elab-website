/* ==========================================================================
   ELAB Website — Shared Interactive Script
   Hybrid Structure: index.html + cases.html + estimate.html + contact.html
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderScroll();
  initServiceAccordion();
  initCaseFilters();
  initCaseModalEvents();
  initCasesCategoryNav();
  initHeroCardLightbox();
  initScrollReveal();
  initStickyQuoteCard();
  initEstimateFormPrefill();
});

/* --------------------------------------------------------------------------
   1. Navigation: Active Link + Mobile Drawer
   -------------------------------------------------------------------------- */
function initNavigation() {
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavDrawer  = document.getElementById('mobileNavDrawer');
  const closeDrawerBtn   = document.getElementById('closeDrawerBtn');

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const allLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function clearAllActive() {
    allLinks.forEach(l => l.classList.remove('active'));
  }

  function setActiveTarget(targetHref) {
    clearAllActive();
    if (!targetHref) return;
    allLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === targetHref || href.endsWith(targetHref)) {
        link.classList.add('active');
      }
    });
  }

  // Page-specific link activation logic
  if (currentFile === 'cases.html') {
    setActiveTarget('cases.html');
  } else if (currentFile === 'contact.html') {
    setActiveTarget('contact.html');
  } else if (currentFile === 'estimate.html') {
    clearAllActive();
  } else if (currentFile === 'index.html' || currentFile === '') {
    clearAllActive();
    initScrollSpy(setActiveTarget, clearAllActive);
  }

  // Mobile Drawer
  function openDrawer() {
    mobileNavOverlay?.classList.add('active');
    mobileNavDrawer?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileNavOverlay?.classList.remove('active');
    mobileNavDrawer?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileNavToggle?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  mobileNavOverlay?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ScrollSpy for index.html using IntersectionObserver */
function initScrollSpy(setActiveTarget, clearAllActive) {
  const sections = [
    { id: 'about', href: 'index.html#about' },
    { id: 'services', href: 'index.html#services' },
    { id: 'infrastructure', href: 'index.html#infrastructure' }
  ];

  const sectionElements = sections
    .map(s => ({ ...s, el: document.getElementById(s.id) }))
    .filter(s => s.el !== null);

  if (!sectionElements.length) return;

  let currentActiveId = null;

  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -45% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    if (window.scrollY < 250) {
      if (currentActiveId !== null) {
        currentActiveId = null;
        clearAllActive();
      }
      return;
    }

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const matchingSec = sectionElements.find(s => s.el === entry.target);
        if (matchingSec && currentActiveId !== matchingSec.id) {
          currentActiveId = matchingSec.id;
          setActiveTarget(matchingSec.href);
        }
      }
    });
  }, observerOptions);

  sectionElements.forEach(s => observer.observe(s.el));

  window.addEventListener('scroll', () => {
    if (window.scrollY < 200) {
      if (currentActiveId !== null) {
        currentActiveId = null;
        clearAllActive();
      }
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Header Scroll Shadow
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   3. Service Card Accordion
   -------------------------------------------------------------------------- */
function initServiceAccordion() {
  document.querySelectorAll('.service-accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      if (!body) return;

      const isOpen = body.classList.contains('open');

      // Optional: close others first (uncomment for exclusive accordion)
      // document.querySelectorAll('.service-accordion-body.open').forEach(b => {
      //   b.classList.remove('open');
      //   b.previousElementSibling?.classList.remove('open');
      //   b.previousElementSibling.textContent = '세부 항목 보기';
      // });

      body.classList.toggle('open', !isOpen);
      btn.classList.toggle('open', !isOpen);

      const label = btn.querySelector('.accordion-label');
      if (label) label.textContent = isOpen ? '세부 항목 보기' : '접기';
    });
  });
}

/* --------------------------------------------------------------------------
   4. Case Studies Filter (cases.html)
   -------------------------------------------------------------------------- */
function initCaseFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseCards  = document.querySelectorAll('.case-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      caseCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? 'flex' : 'none';
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Case Modal Data & Events
   -------------------------------------------------------------------------- */
const CASE_DATA = {
  case1: {
    title: '용접성 평가',
    category: '용접성 평가',
    desc: '용접부 단면 검사를 통한 건전성 평가 및 미세조직, 경도 측정 등을 종합적으로 수행한 평가 사례입니다.',
    items: [
      '용접부 단면 검사를 통한 건전성 평가 및 미세조직, 경도 측정 등 수행',
      'ISO 5817 규격 기반 용접 결함 및 융합 상태 관찰',
      'AMS 4956 티타늄 용접 시험편 매크로 조직 분석',
    ],
    images: [
      {
        step: '01',
        title: 'ISO 5817에 따른 용접부 단면 검사 결과',
        src: 'images/case5_iso5817_weld.png'
      },
      {
        step: '02',
        title: 'AMS 4956 재질 용접 시험편 Macrostructure 분석 결과',
        src: 'images/case5_ams4956_ti_weld.png'
      }
    ]
  },
  case2: {
    title: '보일러 튜브 균열 및 파손 원인 분석',
    category: '손상 원인 분석',
    desc: '발전/산업용 보일러 튜브 누수 균열부에 대해 육안 관찰 및 SEM 파단면 연계 분석을 통해 균열 전파 메커니즘을 규명한 사례입니다.',
    items: [
      '균열 발생 위치 육안 관찰 및 위치 선정',
      '파단면 및 균열 진행 방향 정밀 분석',
      'SEM 파단면 분석 및 경도 측정 연계',
      '용접 결함과 균열 전파 메커니즘 규명',
    ],
    images: [
      {
        step: '01',
        title: '파단면에 대한 SEM 분석 결과',
        src: 'images/case3_sem_fracture.png'
      },
      {
        step: '02',
        title: '손상부 단면에 대한 OM 미세조직 사진',
        src: 'images/case3_om_microstructure2.jpg'
      },
      {
        step: '03',
        title: '손상부 단면에 대한 OM 미세조직 사진 (계속)',
        src: 'images/case3_om_microstructure1.jpg'
      },
      {
        step: '04',
        title: '손상부 단면에 대한 경도 측정 결과',
        src: 'images/case3_hardness_table.jpg'
      }
    ]
  },
  case3: {
    title: '사례 3. P92 보일러 튜브 손상 원인 분석',
    category: '손상 원인 분석',
    desc: '고온 내열강 P92 용접부 단면 미세조직 관찰과 Micro Vickers 경도 측정을 연계하여 조직 변화 및 손상 원인을 다각도로 검토한 사례입니다.',
    items: [
      '용접부 단면과 균열 조직 분석',
      '용접 형상 및 결함 평가',
      '델타페라이트와 조직 이상 관찰',
      '크리프 손상과 균열 원인 검토',
      '매크로, 미세조직 및 경도 결과 종합 분석',
    ],
  },
  case4: {
    title: 'Ti-6Al-4V VAR Ingot 매크로 에칭',
    category: '거시조직 분석',
    desc: '대형 티타늄 Ingot 시편의 전면 연마 및 화학 에칭을 통해 편석 및 거시 주조 조직 분포를 평가한 정밀 전처리 사례입니다.',
    items: [
      '실험 개요: 모 연구소에서 제작한 Ti-6Al-4V 합금 VAR Ingot에 대한 전면 매크로에칭(호 제외)을 수행하기 위한 전처리 의뢰 건.',
      '검사 방법: 전면 Grinding(측면부 Hand Grinder로 수행) -> Macro etching (Modified Kroll reagent)',
    ],
    images: [
      {
        step: '01',
        title: '인수된 시험편의 형상 및 매크로 조직 사진',
        src: 'images/case2_ingot_overview.png'
      },
      {
        step: '02',
        title: '전면부 매크로 조직 사진 및 모식도',
        src: 'images/case2_ingot_front.png'
      },
      {
        step: '03',
        title: '단면 길이방향 매크로 조직 사진 및 모식도',
        src: 'images/case2_ingot_cross.jpg'
      }
    ]
  },
  case5: {
    title: '재질별 매크로 및 미세조직 분석',
    category: '미세조직 관찰',
    desc: '다양한 합금 계열 시료별 최적 에칭 조건을 수립하여 광학현미경 기반 결정립 및 조직 상 분포를 정밀 분석한 사례입니다.',
    items: [
      '대상: 철강, 스테인리스강, 알루미늄, 티타늄, 니켈계, 동합금',
      '결정립 및 상 분포 평가',
      '재결정, 편석, 기공 및 균열 관찰',
      '열처리 및 가공 조직 분석',
    ],
    images: [
      {
        step: '01',
        title: 'Stainless Steel 304 매크로 조직',
        src: 'images/case1_ss304_macro.jpg'
      },
      {
        step: '02',
        title: 'Duplex Stainless Steel 매크로 조직',
        src: 'images/case1_duplex_macro.jpg'
      },
      {
        step: '03',
        title: '재질별 OM 미세조직 사진',
        sub: 'Cast Steel, Ferrite+Pearlite, Martensite, Austenite, Ti, Cu, Al 등',
        src: 'images/case1_materials_microstructure.png'
      }
    ]
  },
  case6: {
    title: '경도 분포 및 경화층 평가',
    category: '경도 측정',
    desc: '열처리 및 용접 시편의 표면 경화층(침탄/질화) 깊이와 중심부까지의 경도 변화 프로파일을 정확하게 도출한 평가 사례입니다.',
    items: [
      '용접부와 열영향부 Micro Vickers 경도 측정',
      '위치별 경도 Profile 작성',
      '침탄층 및 질화층 평가',
      '유효 경화 깊이 측정 및 경도 변화 분석',
    ],
  },
  case7: {
    title: '현장 Replica 조직 검사',
    category: '현장 비파괴',
    desc: '고온 설비 부품을 절단하지 않고 현장에서 표면 연마/에칭 후 Replica Film을 채취하여 탄화물 및 크리프 손상을 분석한 현장 진단 사례입니다.',
    items: [
      '현장 설비 표면 정밀 연마 및 에칭 수행',
      'Replica Film 채취 및 미세조직 복제',
      '탄화물 및 Creep Cavity 관찰로 열화 상태 평가',
    ],
    images: [
      {
        step: '01',
        title: 'Replication Method 모식도',
        src: 'images/case7_replica_method.jpg'
      },
      {
        step: '02',
        title: '실제 현장 분석 및 미세조직 복제 결과',
        src: 'images/case7_replica_analysis.png'
      }
    ]
  },
};

function initCaseModalEvents() {
  // Close button
  document.getElementById('modalCloseBtn')?.addEventListener('click', closeCaseModal);

  // Overlay click to close
  document.getElementById('caseModalOverlay')?.addEventListener('click', e => {
    if (e.target.id === 'caseModalOverlay') closeCaseModal();
  });

  // Escape key to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCaseModal();
  });
}

function openCaseModal(caseId) {
  const overlay = document.getElementById('caseModalOverlay');
  const body    = document.getElementById('modalContentBody');
  const data    = CASE_DATA[caseId];
  if (!data || !overlay || !body) return;

  const imagesHtml = data.images && data.images.length > 0 ? `
    <div style="margin-top:16px;margin-bottom:20px;">
      <h4 style="font-size:0.925rem;font-weight:800;color:#173553;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        분석 사진 자료
      </h4>
      <div class="tech-panel-body">
        ${data.images.length === 4 ? `
          <div class="tech-panel-damage-row1">
            ${data.images.slice(0, 2).map(img => `
              <div class="tech-panel-item">
                <div class="tech-panel-item-header">
                  <span class="tech-panel-tag">${img.step}</span>
                  <div class="tech-panel-title-group">
                    <h5 class="tech-panel-title">${img.title}</h5>
                  </div>
                </div>
                <div class="tech-panel-img-box">
                  <img src="${img.src}" alt="${img.title}" loading="lazy">
                </div>
              </div>
            `).join('')}
          </div>
          <div class="tech-panel-damage-row2">
            ${data.images.slice(2, 4).map(img => `
              <div class="tech-panel-item">
                <div class="tech-panel-item-header">
                  <span class="tech-panel-tag">${img.step}</span>
                  <div class="tech-panel-title-group">
                    <h5 class="tech-panel-title">${img.title}</h5>
                  </div>
                </div>
                <div class="tech-panel-img-box">
                  <img src="${img.src}" alt="${img.title}" loading="lazy">
                </div>
              </div>
            `).join('')}
          </div>
        ` : data.images.length >= 2 ? `
          <div class="tech-panel-macro-row">
            ${data.images.slice(0, 2).map(img => `
              <div class="tech-panel-item">
                <div class="tech-panel-item-header">
                  <span class="tech-panel-tag">${img.step}</span>
                  <div class="tech-panel-title-group">
                    <h5 class="tech-panel-title">${img.title}</h5>
                  </div>
                </div>
                <div class="tech-panel-img-box">
                  <img src="${img.src}" alt="${img.title}" loading="lazy">
                </div>
              </div>
            `).join('')}
          </div>
          ${data.images.slice(2).map(img => `
            <div class="tech-panel-item">
              <div class="tech-panel-item-header">
                <span class="tech-panel-tag">${img.step}</span>
                <div class="tech-panel-title-group">
                  <h5 class="tech-panel-title">${img.title}</h5>
                </div>
              </div>
              <div class="tech-panel-img-box">
                <img src="${img.src}" alt="${img.title}" loading="lazy">
              </div>
            </div>
          `).join('')}
        ` : `
          ${data.images.map(img => `
            <div class="tech-panel-item">
              <div class="tech-panel-item-header">
                <span class="tech-panel-tag">${img.step}</span>
                <div class="tech-panel-title-group">
                  <h5 class="tech-panel-title">${img.title}</h5>
                </div>
              </div>
              <div class="tech-panel-img-box">
                <img src="${img.src}" alt="${img.title}" loading="lazy">
              </div>
            </div>
          `).join('')}
        `}
      </div>
    </div>
  ` : '';

  body.innerHTML = `
    <div style="font-size:0.78rem;font-weight:800;color:var(--primary-navy);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">
      ${data.category}
    </div>
    <h3 style="font-size:1.3rem;font-weight:800;color:var(--primary-navy);margin-bottom:16px;line-height:1.35;">
      ${data.title}
    </h3>
    <div style="background-color:var(--light-bg);padding:14px 18px;border-radius:var(--radius-sm);margin-bottom:20px;border-left:3px solid var(--primary-navy);">
      <p style="font-size:0.915rem;color:var(--secondary-gray);line-height:1.65;">${data.desc}</p>
    </div>
    <h4 style="font-size:0.95rem;font-weight:800;color:var(--primary-navy);margin-bottom:10px;">주요 수행 내용</h4>
    <ul style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;">
      ${data.items.map(item => `
        <li style="font-size:0.875rem;color:var(--text-black);padding-left:16px;position:relative;line-height:1.5;">
          <span style="position:absolute;left:0;color:var(--primary-navy);font-weight:800;">•</span>${item}
        </li>`).join('')}
    </ul>
    ${imagesHtml}
    <div style="text-align:right;border-top:1px solid var(--border-gray);padding-top:16px;">
      <a href="estimate.html" onclick="closeCaseModal()" class="btn btn-primary" style="font-size:0.875rem;">
        관련 분석 문의하기 →
      </a>
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCaseModal() {
  document.getElementById('caseModalOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   6. Estimate Form — mailto Handler
   -------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
   6. Estimate Form — EmailJS & Mailto Handler
   -------------------------------------------------------------------------- */
window.EMAILJS_CONFIG = {
  serviceID: 'service_5pb14dr',
  templateID: 'template_tcp0i69',
  publicKey: 'OEah7uSvx6jSEYFzr'
};

function handleEstimateFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const get = id => document.getElementById(id)?.value?.trim() ?? '';

  const company      = get('companyName');
  const name         = get('contactName');
  const email        = get('email');
  const phone        = get('phone');
  const metalType    = get('metalType');
  const specimenQty  = get('specimenQty')  || '1';
  const specimenSize = get('specimenSize') || '미기재';
  const purpose      = get('purpose')      || '미기재';
  const comments     = get('comments')     || '없음';

  const selected = Array.from(
    document.querySelectorAll('input[name="services"]:checked')
  ).map(cb => cb.value);

  if (!company || !name || !email || !phone || !metalType) {
    alert('필수 입력 항목(*)을 모두 작성해주세요.');
    return;
  }

  if (selected.length === 0) {
    alert('최소 1개 이상의 요청 분석 항목을 선택해주세요.');
    return;
  }

  const templateParams = {
    company_name: company,
    contact_name: name,
    reply_to: email,
    phone: phone,
    metal_type: metalType,
    specimen_qty: specimenQty,
    specimen_size: specimenSize,
    purpose: purpose,
    services: selected.join(', '),
    message: comments
  };

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = '전송 중...';
  }

  const fullSummaryText =
`[ELAB 분석 문의 접수]
회사/기관명: ${company}
담당자명: ${name}
연락처: ${phone} | 이메일: ${email}
시편 재질: ${metalType} | 수량: ${specimenQty} EA | 크기: ${specimenSize}
분석 목적: ${purpose}
요청 항목: ${selected.join(', ')}
상세 요청: ${comments}`;

  if (window.emailjs && window.EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.send(window.EMAILJS_CONFIG.serviceID, window.EMAILJS_CONFIG.templateID, templateParams, window.EMAILJS_CONFIG.publicKey)
      .then(() => {
        showConfirmationModal(company, name, email, phone, selected, fullSummaryText, true);
        form.reset();
      })
      .catch((err) => {
        console.error('EmailJS send error:', err);
        alert('자동 전송 중 오류가 발생하여 기본 이메일 앱으로 연결합니다.');
        triggerMailtoFallback(company, name, email, phone, metalType, specimenSize, specimenQty, purpose, selected, comments);
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = '견적 문의 보내기 →';
        }
      });
  } else {
    triggerMailtoFallback(company, name, email, phone, metalType, specimenSize, specimenQty, purpose, selected, comments);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = '견적 문의 보내기 →';
    }
  }
}

function triggerMailtoFallback(company, name, email, phone, metalType, specimenSize, specimenQty, purpose, selected, comments) {
  const subject = `[ELAB 분석 문의] ${company} - ${name} 님`;
  const bodyText =
`안녕하세요, ELAB 금속재료 분석 서비스 견적 문의입니다.

■ 의뢰자 정보
- 회사/기관명: ${company}
- 담당자명: ${name}
- 이메일: ${email}
- 연락처: ${phone}

■ 시편 및 분석 정보
- 시편 재질: ${metalType}
- 시편 형상 및 크기: ${specimenSize}
- 시편 수량: ${specimenQty} EA
- 분석 목적: ${purpose}
- 요청 분석 항목: ${selected.join(', ')}

■ 상세 요청사항
${comments}

----------------------------------------
이 메일은 ELAB 공식 홈페이지 견적 문의 양식을 통해 작성되었습니다.`;

  window.location.href =
    `mailto:elabkdh@naver.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  showConfirmationModal(company, name, email, phone, selected, bodyText, false);
}

function showConfirmationModal(company, name, email, phone, services, fullText, isAutoSent = true) {
  const overlay = document.getElementById('caseModalOverlay');
  const body    = document.getElementById('modalContentBody');
  if (!overlay || !body) return;

  const escapedText = fullText.replace(/\\/g, '\\\\').replace(/`/g, '\\`');

  const modalIcon = isAutoSent
    ? `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-navy)" stroke-width="2.5">
         <polyline points="20 6 9 17 4 12"></polyline>
       </svg>`
    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-navy)" stroke-width="2">
         <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
         <polyline points="22,6 12,13 2,6"/>
       </svg>`;

  const modalTitle = isAutoSent ? '견적 문의 자동 접수 완료' : '이메일 연결 안내';
  const modalDesc = isAutoSent
    ? '견적 문의가 <strong>elabkdh@naver.com</strong>으로 정상 수신되었습니다.<br>담당자(김도훈 대표)가 확인 후 신속히 답변드리겠습니다.'
    : '기본 이메일 프로그램이 열립니다.<br>내용 확인 후 <strong>elabkdh@naver.com</strong>으로 전송해주세요.';

  body.innerHTML = `
    <div style="text-align:center;padding:10px 0;">
      <div style="width:56px;height:56px;background:rgba(16,42,67,0.08);color:var(--primary-navy);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        ${modalIcon}
      </div>
      <h3 style="font-size:1.3rem;font-weight:800;color:var(--primary-navy);margin-bottom:8px;">${modalTitle}</h3>
      <p style="font-size:0.915rem;color:var(--secondary-gray);margin-bottom:20px;line-height:1.55;">
        ${modalDesc}
      </p>
      <div style="background:var(--light-bg);padding:14px 18px;border-radius:var(--radius-sm);border:1px solid var(--border-gray);text-align:left;font-size:0.875rem;margin-bottom:20px;line-height:1.6;">
        <div><strong>의뢰처:</strong> ${company} (${name} 님)</div>
        <div><strong>연락처:</strong> ${phone} | ${email}</div>
        <div><strong>요청 항목:</strong> ${services.join(', ')}</div>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-secondary" onclick="copyText(\`${escapedText}\`)" style="flex:1;font-size:0.875rem;">문의 내용 복사</button>
        <button class="btn btn-primary" onclick="closeCaseModal()" style="flex:1;font-size:0.875rem;">확인</button>
      </div>
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert('문의 내용이 클립보드에 복사되었습니다.'))
    .catch(() => alert('클립보드 복사에 실패했습니다.'));
}

/* --------------------------------------------------------------------------
   7. cases.html Category Sticky Nav & Dynamic ScrollSpy
   -------------------------------------------------------------------------- */
function initCasesCategoryNav() {
  const categoryNav = document.getElementById('casesCategoryNav');
  if (!categoryNav) return;

  const header = document.getElementById('header');
  const tabs = document.querySelectorAll('.cases-tab-btn');
  const sections = Array.from(document.querySelectorAll('.cases-category-sec'));
  if (!sections.length || !tabs.length) return;

  // Calculate dynamic header and tab bar heights
  function updateHeights() {
    const hHeight = header ? header.offsetHeight : 100;
    const tHeight = categoryNav ? categoryNav.offsetHeight : 54;

    document.documentElement.style.setProperty('--header-height', hHeight + 'px');
    document.documentElement.style.setProperty('--tab-height', tHeight + 'px');

    return hHeight + tHeight;
  }

  let totalTopOffset = updateHeights();

  window.addEventListener('resize', () => {
    totalTopOffset = updateHeights();
  });

  function clearTabs() {
    tabs.forEach(t => t.classList.remove('active'));
  }

  function setActiveTab(secId) {
    clearTabs();
    if (!secId) return;

    const activeTab = document.querySelector(`.cases-tab-btn[data-sec="${secId}"]`) ||
                      document.querySelector(`.cases-tab-btn[href="#${secId}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
      // Scroll active tab horizontally inside category container (never scroll window)
      const container = activeTab.parentElement || document.getElementById('casesCategoryContainer');
      if (container) {
        const targetLeft = activeTab.offsetLeft - container.clientWidth / 2 + activeTab.clientWidth / 2;
        container.scrollTo({
          left: targetLeft,
          behavior: 'smooth'
        });
      }
    }
  }

  let activeSecId = null;

  // Dynamic IntersectionObserver using calculated offset
  const observerOptions = {
    root: null,
    rootMargin: `-${totalTopOffset + 12}px 0px -40% 0px`,
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    // Top Banner check: clear active tabs if above first section
    const firstSecTop = sections[0].offsetTop;
    if (window.scrollY < firstSecTop - totalTopOffset - 40) {
      if (activeSecId !== null) {
        activeSecId = null;
        clearTabs();
      }
      return;
    }

    // Bottom of page check: force last section (#replica) active
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50);
    if (isAtBottom) {
      const lastSec = sections[sections.length - 1];
      if (activeSecId !== lastSec.id) {
        activeSecId = lastSec.id;
        setActiveTab(lastSec.id);
      }
      return;
    }

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (activeSecId !== entry.target.id) {
          activeSecId = entry.target.id;
          setActiveTab(entry.target.id);
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // Scroll listener for top banner area and bottom of page edge cases
  window.addEventListener('scroll', () => {
    const firstSecTop = sections[0].offsetTop;

    if (window.scrollY < firstSecTop - totalTopOffset - 30) {
      if (activeSecId !== null) {
        activeSecId = null;
        clearTabs();
      }
    } else {
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50);
      if (isAtBottom) {
        const lastSec = sections[sections.length - 1];
        if (activeSecId !== lastSec.id) {
          activeSecId = lastSec.id;
          setActiveTab(lastSec.id);
        }
      }
    }
  }, { passive: true });

  // Smooth scroll handler for tab clicks
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('data-sec') || tab.getAttribute('href')?.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - totalTopOffset - 14;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // Handle initial page load hash scroll offset (Desktop only; disabled on mobile/tablet <=1024px to prevent vertical scroll jumping)
  const isMobileOrTablet = window.matchMedia('(max-width: 1024px)').matches;
  if (window.location.hash && !isMobileOrTablet) {
    let userHasScrolled = false;

    // Detect manual user scroll/touch/key input to prevent overriding user scroll intent
    const markUserScrolled = () => {
      userHasScrolled = true;
      window.removeEventListener('wheel', markUserScrolled);
      window.removeEventListener('touchmove', markUserScrolled);
      window.removeEventListener('scroll', markUserScrolled);
      window.removeEventListener('keydown', markUserScrolled);
      window.removeEventListener('mousedown', markUserScrolled);
    };

    window.addEventListener('wheel', markUserScrolled, { passive: true });
    window.addEventListener('touchmove', markUserScrolled, { passive: true });
    window.addEventListener('scroll', markUserScrolled, { passive: true });
    window.addEventListener('keydown', markUserScrolled, { passive: true });
    window.addEventListener('mousedown', markUserScrolled, { passive: true });

    const scrollToHashTarget = (isSmooth = true) => {
      if (userHasScrolled) return;

      const hashId = decodeURIComponent(window.location.hash.replace('#', ''));
      const targetEl = document.getElementById(hashId);
      if (!targetEl) return;

      const currentTopOffset = updateHeights();
      const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - currentTopOffset - 14;
      window.scrollTo({ top: Math.max(0, targetPos), behavior: isSmooth ? 'smooth' : 'auto' });
    };

    // 1. Instant jump on DOM ready
    scrollToHashTarget(false);

    // 2. Scheduled smooth scroll adjustments (only if user hasn't scrolled)
    setTimeout(() => scrollToHashTarget(true), 120);
    setTimeout(() => scrollToHashTarget(true), 350);

    // 3. Final precision adjustment after ALL images finish loading
    window.addEventListener('load', () => {
      if (!userHasScrolled) {
        scrollToHashTarget(true);
        setTimeout(() => scrollToHashTarget(true), 250);
      }
    });

    // 4. Listen to load events of images above target to prevent image-loading height drift
    const allImgs = document.querySelectorAll('main img');
    allImgs.forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', () => {
          if (!userHasScrolled) {
            scrollToHashTarget(false);
          }
        });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8. Hero Card Image Lightbox Modal
   -------------------------------------------------------------------------- */
function initHeroCardLightbox() {
  // Dynamically create lightbox overlay container if not present
  let lightbox = document.getElementById('heroImageLightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'heroImageLightbox';
    lightbox.className = 'hero-lightbox-overlay';
    lightbox.innerHTML = `
      <div class="hero-lightbox-container">
        <button class="hero-lightbox-close" id="heroLightboxClose" aria-label="닫기">✕</button>
        <div class="hero-lightbox-header">
          <h3 class="hero-lightbox-title" id="heroLightboxTitle">이미지 확대보기</h3>
        </div>
        <div class="hero-lightbox-img-box">
          <img src="" alt="" id="heroLightboxImg">
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg   = document.getElementById('heroLightboxImg');
  const lightboxTitle = document.getElementById('heroLightboxTitle');
  const closeBtn      = document.getElementById('heroLightboxClose');

  const cardData = {
    '시편 전처리': {
      title: '시편 전처리 (Specimen Preparation)',
    },
    '광학현미경 (OM)': {
      title: '광학현미경 (OM, Optical Microscopy)',
    },
    '주사전자현미경 (SEM)': {
      title: '주사전자현미경 (SEM, Scanning Electron Microscopy)',
    }
  };

  function openLightboxWithData(src, title) {
    if (!lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || '이미지 확대보기';

    if (lightboxTitle) {
      lightboxTitle.textContent = title || '재료분석 원본 확대 이미지';
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Hero cards click handler (excluding static no-lightbox cards)
  const cardItems = document.querySelectorAll('.hero-card-item:not(.no-lightbox)');
  cardItems.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const imgEl = card.querySelector('.hero-card-img-box img');
      const labelEl = card.querySelector('.hero-card-label');
      if (!imgEl) return;

      const imgSrc = imgEl.getAttribute('src');
      const labelText = labelEl ? labelEl.textContent.trim() : '';
      const info = cardData[labelText] || { title: labelText };
      openLightboxWithData(imgSrc, info.title);
    });
  });

  // Global delegation for Technical Panel Images click to enlarge
  document.addEventListener('click', (e) => {
    const techImg = e.target.closest('.tech-panel-img-box img, .case-image-wrapper img');
    if (techImg) {
      e.stopPropagation();
      const imgSrc = techImg.getAttribute('src');
      const itemBox = techImg.closest('.tech-panel-item, .case-image-item');
      
      const titleEl = itemBox?.querySelector('.tech-panel-title, .case-image-label');
      const titleText = titleEl ? titleEl.textContent.trim() : (techImg.getAttribute('alt') || '재료분석 원본 사진');

      openLightboxWithData(imgSrc, titleText);
    }
  });

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   8. Scroll Reveal Observer
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* --------------------------------------------------------------------------
   9. Sticky Quick Quote Card & Auto Pre-fill Handlers
   -------------------------------------------------------------------------- */
function initStickyQuoteCard() {
  const card = document.getElementById('stickyQuoteCard');
  const submitBtn = document.getElementById('stickyQuoteSubmitBtn');
  if (!card || !submitBtn) return;

  const container = document.getElementById('casesMainContainer') || document.querySelector('main .container');
  const mainEl = document.getElementById('casesMainContent') || document.querySelector('main');
  const categoryNav = document.getElementById('casesCategoryNav');

  const nameInput = document.getElementById('stickyName');
  const phoneInput = document.getElementById('stickyPhone');
  const requestInput = document.getElementById('stickyRequest');
  const checkboxes = document.querySelectorAll('input[name="stickyServices"]');

  const nameError = document.getElementById('stickyNameError');
  const phoneError = document.getElementById('stickyPhoneError');
  const serviceError = document.getElementById('stickyServiceError');

  // --- Smooth Follow Floating Engine (requestAnimationFrame + lerp) ---
  let currentY = 0;
  let targetY = 0;
  const ease = 0.11; // Easing factor: ~0.2s smooth deceleration behind scroll

  function calculateCardPosition() {
    if (!container || !mainEl) return;
    const windowWidth = window.innerWidth;
    const containerRect = container.getBoundingClientRect();
    const mainRect = mainEl.getBoundingClientRect();
    const cardHeight = card.offsetHeight;

    // Minimum width check: Container (1200px) + Gap (16px) + Card (250px) + Safety (16px) = ~1482px
    if (windowWidth < 1480) {
      card.style.display = 'none';
      return;
    } else {
      card.style.display = 'block';
    }

    // X position: Exactly 16px to the right of main content container
    const cardX = window.scrollX + containerRect.right + 16;

    // Y bounds (Document coordinates)
    // minY: Top of main content area (right below Sticky Category Navigation Bar, NEVER in Page Banner)
    const minY = window.scrollY + mainRect.top + 20;
    // maxY: End of main content area (NEVER overlap Footer)
    const maxY = Math.max(minY, window.scrollY + mainRect.bottom - 40 - cardHeight);

    // Desired Y: Center card vertically in viewport (+50px downward shift for perfect screen middle alignment)
    let navBottomOffset = 220;
    if (window.innerHeight > 650) {
      navBottomOffset = Math.max(210, Math.round((window.innerHeight - cardHeight) / 2 + 50));
    } else if (categoryNav) {
      const navRect = categoryNav.getBoundingClientRect();
      navBottomOffset = Math.max(160, navRect.bottom + 40);
    }
    const desiredY = window.scrollY + navBottomOffset;

    // Clamp Y target between minY and maxY
    targetY = Math.min(Math.max(desiredY, minY), maxY);

    // Smooth Lerp
    currentY += (targetY - currentY) * ease;

    // Apply transform via hardware acceleration
    card.style.transform = `translate3d(${Math.round(cardX)}px, ${Math.round(currentY)}px, 0)`;
  }

  function renderSmoothFollow() {
    calculateCardPosition();
    requestAnimationFrame(renderSmoothFollow);
  }

  // Initial Y setup
  if (mainEl) {
    const initialMainRect = mainEl.getBoundingClientRect();
    currentY = window.scrollY + initialMainRect.top + 20;
    targetY = currentY;
  }

  // Start smooth follow loop
  renderSmoothFollow();

  window.addEventListener('resize', () => {
    calculateCardPosition();
  }, { passive: true });

  // --- Category Checkbox Auto Sync ---
  let userHasInteractedWithCheckboxes = false;
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      userHasInteractedWithCheckboxes = true;
    });
  });

  const categoryMap = {
    'micro': '미세조직 분석',
    'macro': '용접부 건전성 평가',
    'flowline': '시험편 전처리',
    'sem-micro': 'SEM / EDS 분석',
    'sem-eds': 'SEM / EDS 분석',
    'epma': 'EPMA 분석',
    'damage': '손상 원인 분석',
    'welding': '용접부 건전성 평가',
    'replica': '현장 Replica 검사'
  };

  function syncDefaultCategorySelection(secId) {
    if (userHasInteractedWithCheckboxes) return;
    const defaultVal = categoryMap[secId];
    if (!defaultVal) return;

    checkboxes.forEach(cb => {
      if (cb.value === defaultVal) {
        cb.checked = true;
      }
    });
  }

  const sections = document.querySelectorAll('.cases-category-sec');
  if (sections.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          syncDefaultCategorySelection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(sec => observer.observe(sec));
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^0-9-]/g, '');
      e.target.value = val;
    });
  }

  submitBtn.addEventListener('click', () => {
    let isValid = true;
    if (nameError) nameError.textContent = '';
    if (phoneError) phoneError.textContent = '';
    if (serviceError) serviceError.textContent = '';

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const requestVal = requestInput ? requestInput.value.trim() : '';

    const selectedServices = Array.from(document.querySelectorAll('input[name="stickyServices"]:checked')).map(cb => cb.value);

    if (!nameVal) {
      if (nameError) nameError.textContent = '이름을 입력해주세요.';
      if (nameInput) nameInput.focus();
      isValid = false;
    }

    if (!phoneVal) {
      if (phoneError) phoneError.textContent = '연락처를 입력해주세요.';
      if (isValid && phoneInput) phoneInput.focus();
      isValid = false;
    }

    if (selectedServices.length === 0) {
      if (serviceError) serviceError.textContent = '분석 항목을 1개 이상 선택해주세요.';
      isValid = false;
    }

    if (!isValid) return;

    const quoteDraft = {
      name: nameVal,
      phone: phoneVal,
      services: selectedServices,
      request: requestVal
    };

    try {
      sessionStorage.setItem('elabQuoteDraft', JSON.stringify(quoteDraft));
    } catch (e) {
      console.error('Failed to save quote draft to sessionStorage:', e);
    }

    window.location.href = 'estimate.html';
  });
}

function initEstimateFormPrefill() {
  const estimateForm = document.getElementById('estimateForm');
  if (!estimateForm) return;

  const rawDraft = sessionStorage.getItem('elabQuoteDraft');
  if (!rawDraft) return;

  try {
    const draft = JSON.parse(rawDraft);
    if (!draft) return;

    const contactNameEl = document.getElementById('contactName');
    const phoneEl = document.getElementById('phone');
    const commentsEl = document.getElementById('comments');

    if (contactNameEl && draft.name && !contactNameEl.value) {
      contactNameEl.value = draft.name;
    }

    if (phoneEl && draft.phone && !phoneEl.value) {
      phoneEl.value = draft.phone;
    }

    if (commentsEl && draft.request && !commentsEl.value) {
      commentsEl.value = draft.request;
    }

    if (draft.services && draft.services.length > 0) {
      const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
      serviceCheckboxes.forEach(cb => {
        if (draft.services.includes(cb.value)) {
          cb.checked = true;
        }
      });
    }
  } catch (e) {
    console.error('Error pre-filling estimate form:', e);
  }
}



