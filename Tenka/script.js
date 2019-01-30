const targets = document.querySelectorAll('.target');

function showTargetInfo(){
    const tInfo = this.querySelector('.target-info');
    const tImg = this.querySelector('.img');
    if(!tImg.classList.contains('active')){
        tImg.classList.remove('inactive')
        tImg.classList.add('active');
        tImg.addEventListener('animationend',()=>{
            if(!tImg.classList.contains('inactive')){
                
                tInfo.style.display = 'initial';
            }
        }) 
    }else{
        tImg.classList.add('inactive');
        tImg.classList.remove('active');
        tImg.addEventListener('animationstart',()=>{
            tInfo.style.display = 'none';
        }) 
    }
}

targets.forEach(target => target.addEventListener('click',showTargetInfo));
