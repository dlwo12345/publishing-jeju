/* ie background-fixed 튐 현상 해결을 위한 스크립트 */
function ie_fixed(){
    if(navigator.userAgent.match(/Trident\/7\./)) { // if IE
        $('body').on("mousewheel", function () {
            event.preventDefault(); 

            // 스크롤 부드럽게
            var wheelDelta = event.wheelDelta;
            var currentScrollPosition = window.pageYOffset;
            window.scrollTo(0, currentScrollPosition - wheelDelta);
        });
    }
}

// header 메뉴에 마우스 올렸을때 소메뉴 출력
function menu_hover(){
    var $menuLi = $('.header_menu > li');
   $menuLi.hover(function(){
        $menuLi.children('.header_menu_submenu').stop(true).slideToggle();
   });
}

// 스크롤 스파이
(function($){
// 생성자
function HongScroll(selector){
    // 제이쿼리 최적화용 변수들
    this.$html = null;
    this.$q_menu = null;
    this.$q_menu_ul = null;
    this.$q_menu_li = null;
    this.now_scroll = 0; // 현재 나의 스크롤 위치값 저장하는 변수
    this.scroll_num = []; // 영역별 스크롤 위치값 저장하기 위한변수
    this.scroll_last_bottom = 0; // 마지막 위치값 저장하기
    this.$select_li = null; // 메뉴 선택된것이 있는지 체크
    this.select_num = null; // 선택 할때 몇번 선택했는지 체크
    this.start(selector); // 기능 실행
}
    // start
    HongScroll.prototype.start=function(selector){
        this.init(selector); // 변수초기화
        this.initEvent(); // 기능
        this.menu_select(); // 첫 시작용 메뉴선택함수 호출
    }
    
    // 변수 초기화(처음부터 초기화하고 시작하는 변수들)
    HongScroll.prototype.init=function(selector){
        this.$html = $("html,body");
        this.$q_menu = $(selector); // 퀵메뉴 영역
        this.$q_menu_ul = this.$q_menu.children('ul'); // 퀵메뉴 ul
        this.$q_menu_li = this.$q_menu_ul.children('li'); // 퀵메뉴 li
        this.$scroll = $(".scroll"); // 메뉴 클릭시 이동될 영역들
        this.scroll_length = this.$scroll.length;// 메뉴 클릭시 이동될 영역들 갯수
        
        // 영역별 스크롤 위치값 저장하기
        for(var i=0; i<this.scroll_length;i++){
            this.scroll_num[i] = parseInt($(".scroll").eq(i).offset().top);
            console.log("scroll"+i+" : "+this.scroll_num[i]);
        }
        // 영역의 마지막 bottom값 구하기
        this.scroll_last_bottom = this.$scroll.last().offset().top + this.$scroll.last().outerHeight(true);
    }
    
    // 이벤트 모음
    HongScroll.prototype.initEvent=function(){
        // 하위 이벤트에서 실행 주체가 바뀌기 때문에 현재 this값 저장하고 아래에서 땡겨서 사용한다.
        var objThis = this; 
        
        // 이동 메뉴 클릭했을때
        objThis.$q_menu_li.click(function(){
            var index = $(this).index(); // 내가 클릭한 번호
            objThis.$html.animate({'scrollTop':objThis.scroll_num[index]}); // 이동
        });
        
        // 윈도우 스크롤 이벤트
        $(window).scroll(function(){
            // 현재 나의 스크롤 위치값 갱신
            objThis.now_scroll = parseInt($(window).scrollTop());
 
            objThis.menu_select(); // 선택 함수 호출(위치값에 해당하는 버튼 색상변경)
        });
    }
    
    // 현재 위치별 메뉴 select(색상변경)
    HongScroll.prototype.menu_select=function(){
        
        // 각 시작영역과 크거나 같고 다음영역보다 작을때
        for(var i=0;i<this.scroll_length-1;i++){
            // 첫번째 영역 진입 전
            if(this.now_scroll<this.scroll_num[0]){
                this.select_remove(-1); // select 지우기
            }
            // 각 영역
            else if(this.now_scroll>=this.scroll_num[i] && this.now_scroll<this.scroll_num[i+1]){
                this.select(i);
            }
            
            // 영역이 마지막 또는 그 이후일때
            else if(i==this.scroll_length-2){
                // 영역이 마지막일때
                if(this.now_scroll>=this.scroll_num[this.scroll_length-1] && this.now_scroll<this.scroll_last_bottom){
                    this.select(this.scroll_length-1);
                }
                
                // 영역 마지막 이후 처리
                else if(this.now_scroll>this.scroll_last_bottom){
                    this.select_remove(-1); // select 지우기
                }
            }
        }
    }
    
    // 현재 위치별 메뉴 select(색상변경) 체크 및 실행
    HongScroll.prototype.select=function(num){
        this.select_remove(num); // select 지우기
        this.select_add(num); // select 추가하기
    }
    
    // 현재 위치별 메뉴 select(색상변경) 지우기
    HongScroll.prototype.select_remove=function(num){
        if(this.$select_li!=null){
            if(this.select_num != num){
                this.$select_li.removeClass('select');
                this.$select_li=null;
            }
        }
    }
    
    // 현재 위치별 메뉴 select(색상변경) 추가하기
    HongScroll.prototype.select_add=function(num){
        this.$select_li = this.$q_menu_li.eq(num);
        this.$select_li.addClass('select'); 
        this.select_num = num;
    }
    
    $.fn.hongScroll=function(){
        this.each(function(index){
            var hongScroll = new HongScroll(this);
        })
        return this;
    }
})(jQuery)

// 헤더 스크롤 이벤트
function scroll(){
    var now_scroll = 0; // 현재위치값을 저장할 변수
    
     // 스크롤에 따라 header가 노출되고 숨겨지는 효과 정의한 부분 
    function header_move(){
        var $header = $(".header");
        if(now_scroll>50){
            $header.css('top','0px');
        }else{
            $header.css('top','-180px');
        }
    }
    
    // 스크롤 이벤트 발생시
    $(window).scroll(function(){
        now_scroll = $(window).scrollTop(); // 현재 위치값 받아오기
        header_move(); // 헤더 show and hide 동작 함수
        $('.scrollhtml').html(now_scroll);// 스크롤 위치 디버깅용
    })
}

// 제주올레 소식에 버튼누르면 오픈 되는것 모음 함수
function notice(){
    var $notice_rightBtn = $('.notice_right>i'); // 오픈 화살표 버튼
    var $notice_right_open = $('.notice_right_open');
    
    // 버튼이 눌렸을때 영역 넓히고 줄이는 함수 부분
    function notice_open() {
        if($notice_right_open.hasClass('close')){
            $notice_right_open.removeClass('close');
            $notice_rightBtn.attr('class','fa fa-chevron-circle-up fa-2x');
        }else{
            $notice_right_open.addClass('close');
            $notice_rightBtn.attr('class','fa fa-chevron-circle-down fa-2x');
        }
    }
    // 버튼이 눌렸을때 이벤트 호출하는 부분
    $notice_rightBtn.click(function(){
      notice_open(); // // 버튼 눌렀을때 보조메뉴 활성화되는 효과 주기
    }); 
}