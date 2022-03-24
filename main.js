const $ = document.querySelector.bind(document)
const $S = document.querySelectorAll.bind(document)


const songs = [
        {
            name: "Chẳng thể tìm được em",
            singer: "Freak D",
            path:"./music/ChangTheTimDuocEm.mp3",
            image: "./image/1.jpg"
        },
        {
            name: "Bài ca tuổi trẻ",
            singer: "DALAB",
            path:"./music/BaiCaTuoiTre.mp3",
            image: "./image/2.jpg"
        },
        {
            name: "Có Em Bên Đời",
            singer: "DALAB",
            path:"./music/CoEmBenDoi.mp3",
            image: "./image/3.jpg"
        },
        {
            name: "Một Cú Lừa",
            singer: "Bich Phuong",
            path:"./music/MotCuLua.mp3",
            image: "./image/4.jpg"
        },
        {
            name: "Một Nhà",
            singer: "DALAB",
            path:"./music/MotNha.mp3",
            image: "./image/5.jpg"
        },
        {
            name: "Ngày Khác Lạ",
            singer: "Đen",
            path:"./music/NgayKhacLa.mp3",
            image: "./image/6.jpg"
        },
        {
            name: "Có Hẹn Với Thanh Xuân",
            singer: "Miu",
            path:"./music/cohenvoithanhxuan.mp3",
            image: "./image/7.jpg"
        },
        {
            name: "Đế Vương",
            singer: "Đen",
            path:"./music/DeVuong.mp3",
            image: "./image/8.jpg"
        },
        {
            name: "Hôm Nay Tôi Buồn",
            singer: "Phùng Khánh Linh",
            path:"./music/HomNayToiBuon.mp3",
            image: "./image/9.jpg"
        },
        {
            name: "Muộn Rồi Mà Sao Còn",
            singer: "Sơn Tùng MTP",
            path:"./music/MuonRoiMaSaoCon.mp3",
            image: "./image/10.jpg"
        },
        {
            name: "Những Kẻ Mộng Mơ",
            singer: "Freak D",
            path:"./music/NhungKeMongMo.mp3",
            image: "./image/11.jpg"
        },
        {
            name: "Phải Chăng Em Đã Yêu",
            singer: "...",
            path:"./music/PhaiChangEmDaYeu.mp3",
            image: "./image/12.jpg"
        },
        {
            name: "Sài Gòn Đau Lòng Quá",
            singer: "...",
            path:"./music/SaiGonDauLongQua.mp3",
            image: "./image/13.jpg"
        },
        {
            name: "Tìm Được Nhau Khó Thế Nào",
            singer: "...",
            path:"./music/TimDuocNhauKhoTheNao.mp3",
            image: "./image/14.jpg"
        }
    ]
    
var currentIndex = 0
const playList = $('.playlist')
const heading = $('header h2')
const thumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const cdWidth = cd.offsetWidth
const playBtn = $('.btn-toggle-play')
const player = $('.player')
let progress = $('#progress')
let isPlaying = false
let isRandom =false
let isRepeat = false
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


function render(){
    const htmls = songs.map(function(song,index){
        return `
        <div class="song ${index == currentIndex? 'active' : ''}" data-index=${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
    })

    playList.innerHTML = htmls.join('\n');
}

function handleEvent(){
    const cdAnimate =  thumb.animate([
        {
            transform: 'rotate(360deg)'
        }],{
            duration: 15000,
            iterations: Infinity
        })
        cdAnimate.pause()
    document.onscroll = function(){
        const scrollTop = document.documentElement.scrollTop
        const newCDWidth = cdWidth - scrollTop
        cd.style.width = newCDWidth >= 0 ? newCDWidth + 'px' : 0
        cd.style.opacity = newCDWidth/cdWidth
    }

    playBtn.addEventListener('click',function(){
        if(isPlaying){
            audio.pause()
        }else{
            audio.play()
        }
        
    })
    
    audio.onplay = function(){
        isPlaying = true
        player.classList.add('playing')
        cdAnimate.play()
    }

    audio.onpause = function(){
        isPlaying = false
        player.classList.remove('playing')
        cdAnimate.pause()
    }

    audio.ontimeupdate = function(){
        if(audio.duration){
            const progressPercent = audio.currentTime/audio.duration *100
            progress.value = progressPercent
        }
    }

    progress.onchange = function(){
       audio.currentTime =  Math.floor(progress.value/100*audio.duration)
    }

    nextBtn.onclick = function(){
        if(isRandom){
            randSong()
        }else{
            nextSong()
        }
        audio.play()
        render()
        scrollToActiveSong()
    }

    prevBtn.onclick = function(){
        if(isRandom){
            randSong()
        }else{
            prevSong()
        }
        audio.play()
        render()
        scrollToActiveSong()

    }

    randomBtn.onclick = function(){
        // console.log(randomBtn.classList)
        isRandom = !isRandom
        randomBtn.classList.toggle('active')
    }

    audio.onended = function(){
        if(isRepeat){
            audio.play()
            render()
            scrollToActiveSong()

        }else{
            nextBtn.click()

        }
    }

    repeatBtn.onclick = function(){
        isRepeat = !isRepeat
        repeatBtn.classList.toggle('active')
    }

    playList.onclick =  function(e){
        let songNode = e.target.closest('.song:not(.active')
        if( e.target.closest('.option') || songNode){
            if(songNode){
                currentIndex = songNode.getAttribute('data-index')
                loadCurSong()
                render()
                audio.play()
            }
        }
    }
}

function loadCurSong(){
    var currentSong =  songs[currentIndex]
    heading.textContent = currentSong.name
    thumb.style.backgroundImage = `url('${currentSong.image}')`
    audio.src = currentSong.path

} 

function nextSong(){
    if(currentIndex >= songs.length -1){
        currentIndex = 0
    }else{
        currentIndex ++
    }
    loadCurSong()
}

function prevSong(){
    if(currentIndex <= 0){
        currentIndex = songs.length - 1
    }else{
        currentIndex --
    }
    loadCurSong()
}

function randSong(){
    let randomIndex
    do{
        randomIndex = Math.floor(Math.random()*songs.length)

    }while(currentIndex == randomIndex)
    currentIndex = randomIndex
    loadCurSong()
    audio.play()
}

function scrollToActiveSong(){
    setTimeout(()=> {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })
    },0)
}
 

render()
handleEvent()
loadCurSong()
