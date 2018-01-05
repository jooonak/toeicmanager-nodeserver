#toeicmanager-nodeserver

NodeServer 기능

NodeServer는 페이지를 제공하지 않고 데이터만 제공하도록 Rest API 형태로 설계하였고, 제공하는 데이터는 다음과 같다.


	1. 챗봇 API인 Mindmap.ai를 활용한 대화내용, 또는 DB의 사용자 학습현황등의 데이터
	2. Crawling도구인 cheerio를 활용한 크롤링된 문장과 이미지 데이터
	3. 사전 API인 glosbe를 활용한 단어 번역 데이터
	4. Google firebase를 활용한 사용자에게 알림메세지 전송 기능
	5. kmeans-node를 활용하여 사용자의 시험보는 시간 데이터를 DB에 저장
	6. natural을 활용하여 사진에서 인식된 text를 토큰화, 형태소 분석을 통해 의미있는 text만을 추출
	7. Google Vision API를 활용한 사진에서 인식된 단어 데이터


chatbot.js

	* cordova에서 전달받은 text를 mindmap.ai로 전송하여 결과값을 리턴받고,
	* 리턴받은 결과값을 다시한번 분석해서 mindmap.ai의 결과를 사용자에게 전달하거나
	* database를 거쳐 암기현황, 자주 틀린 단어 등의 현황정보를 사용자에게 전달한다

crawling.js

	* node의 cheerio를 활용하여 크롤링, 단어 검색할 때 검색하는 단어를 parameter로 받는다
	* 문장 크롤링 - 단어를 입력하면 해당 단어의 문장을 보여주는 사이트에 parameter로 받은 단어를 검색하고, 결과를 크롤링
	* 이미지 크롤링 - parameter로 받은 단어의 구글 이미지 검색 결과에서 src부분만 크롤링한다

dic.js

	* glosbe api를 활용, parameter로 받은 단어의 영 -> 한 번역결과를 반환한다

fcm.js

	* google firebase를 활용해서 시험을 끝내고 10분 후 모른다고 체크했던 단어를 다시 한번 확인할 수 있도록 알림메세지 발송한다

fcmSchedule.js

	* google firebase와 node의 schedule 모듈을 활용해 매일 새벽 2:01에 database에 있는 사용자의 firebase 토큰과
	* K-means알고리즘을 통해 도출된 사용자가 자주 시험보는 시간을 토대로 사용자에게 알림메세지 발송할 수 있도록 설정한다

kmeans.js

	* 사용자가 시험을 시작할 때 데이터가 저장되는 tbl_timecheck 테이블의 데이터를 K-means알고리즘을 통해 
	* 군집화, 대표값을 도출하여 사용자가 자주 시험을 보는 시간을 tbl_member테이블에 업데이트한다.

natural.js

	* natural 모듈을 통해 

ocr.js

	* 사용자가 촬영한 이미지를 받아 google vision을 통해 인식된 text 데이터를 반환한다




