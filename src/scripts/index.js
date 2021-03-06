import Swiper from 'swiper/swiper-bundle.js'
import 'swiper/swiper-bundle.css'
import ScrollMagic from 'scrollmagic'
import { gsap, TweenMax } from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
gsap.registerPlugin(ScrollToPlugin)
;(() => {
  window.addEventListener('DOMContentLoaded', () => {
    // Init smothscroll
    const controller = new ScrollMagic.Controller()
    controller.scrollTo(function (newpos) {
      TweenMax.to(window, 0.6, { scrollTo: { y: newpos } })
    })

    // Load opacity and smothscroll
    setTimeout(() => {
      document.querySelector('body').style.opacity = 1

      if (localStorage.getItem('idBLock')) {
        const element = document.querySelector(
          `#${localStorage.getItem('idBLock')}`
        )
        const topPos = element.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({
          top: topPos
        })
        localStorage.removeItem('idBLock')
      }
    }, 300)

    // Links transition
    if (document.querySelectorAll('a').length) {
      const linksMenu = document.querySelectorAll('a')
      linksMenu.forEach((link) =>
        link.addEventListener('click', function (e) {
          document.getElementById('header-menu').checked = false

          const id = this.getAttribute('href').split('#')[1] || ''
          const linkPathname = this.getAttribute('href').split('#')[0]
          const currentPathname = location.pathname
          if (id.length > 0 && currentPathname === linkPathname) {
            e.preventDefault()
            controller.scrollTo(`#${id}`)
          }
          if (currentPathname !== linkPathname) {
            e.preventDefault()
            localStorage.setItem('idBLock', id)
            location.href = linkPathname
          }
        })
      )
    }

    // Map markers
    if (
      document.querySelectorAll('.about-map__marker span').length &&
      document.documentElement.clientWidth < 768
    ) {
      const mapMarkersText = document.querySelectorAll(
        '.about-map__marker span'
      )

      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
      }

      async function showMarkersText() {
        for (let i = 0; i < mapMarkersText.length; i++) {
          mapMarkersText[i].style.display = 'block'
          await sleep(2000)
          mapMarkersText[i].style.display = 'none'
          if (i === mapMarkersText.length - 1) {
            i = -1
          }
        }
      }
      showMarkersText()
    }

    // Tabs
    if (document.querySelectorAll('.tabs').length) {
      const allTabsNavigationItems = document.querySelectorAll('.tabs__btn')
      allTabsNavigationItems.forEach((item) =>
        item.addEventListener('click', tabChange)
      )
    }

    function tabChange(e) {
      e.preventDefault()
      const tabDataAttr = e.target.getAttribute('data-tab')
      const tabContainers = e.target
        .closest('.tabs')
        .querySelectorAll('.tabs__container')
      const tabNavigationItem = e.target
        .closest('.tabs')
        .querySelectorAll('.tabs__btn')

      tabContainers.forEach((item) => {
        item.classList.remove('tabs__container--active')
        if (item.getAttribute('data-tab') === tabDataAttr) {
          item.classList.add('tabs__container--active')
          initSliderProjects()
          initSliderReviews()
          item.querySelector('.swiper-wrapper').style.transform =
            'translate3d(0px, 0px, 0px)'
        }
      })

      tabNavigationItem.forEach((item) => {
        if (item.getAttribute('data-tab') !== tabDataAttr) {
          item.classList.remove('tabs__btn--active')
        }
      })

      e.target.classList.add('tabs__btn--active')
    }

    // Swiper projects
    initSliderProjects()
    function initSliderProjects() {
      ;(() =>
        new Swiper('.projects__tab.tabs__container--active .swiper-container', {
          speed: 500,
          spaceBetween: 16,
          slideToClickedSlide: true,
          lazy: {
            loadPrevNext: true
          },
          pagination: {
            el: '.projects__tab.tabs__container--active .swiper-pagination'
          },
          navigation: {
            nextEl:
              '.projects__tab.tabs__container--active .swiper-button-next',
            prevEl: '.projects__tab.tabs__container--active .swiper-button-prev'
          },
          breakpoints: {
            768: {
              spaceBetween: 24
            },
            2500: {
              lazy: {
                loadPrevNextAmount: 2
              }
            }
          }
        }))()
    }

    // Swiper reviews
    initSliderReviews()
    function initSliderReviews() {
      ;(() =>
        new Swiper('.reviews__tab.tabs__container--active .swiper-container', {
          speed: 500,
          spaceBetween: 24,
          slideToClickedSlide: true,
          slidesPerView: 1,
          slidesPerGroup: 1,
          pagination: {
            el: '.reviews__tab.tabs__container--active .swiper-pagination'
          },
          breakpoints: {
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              pagination: {
                el: '.reviews__tab.tabs__container--active .swiper-pagination',
                type: 'custom',
                renderCustom: function (swiper, current, total) {
                  function numberAppend(d) {
                    return d < 10 ? '0' + d.toString() : d.toString()
                  }
                  return `<span class="swiper-pagination-customspan">${numberAppend(
                    current
                  )}</span> / <span class="swiper-pagination-totalspan">${numberAppend(
                    total
                  )}</span>`
                }
              },
              navigation: {
                nextEl:
                  '.reviews__tab.tabs__container--active .swiper-button-next',
                prevEl:
                  '.reviews__tab.tabs__container--active .swiper-button-prev'
              }
            }
          }
        }))()
    }
  })
})()
