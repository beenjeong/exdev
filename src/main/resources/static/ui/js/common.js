
const _HUNDRED_MILLION = 100000000 ;


function _yearMonthSelectBox(obj) {

	const yearMonths = [];
	[dayjs().year(),dayjs().year() - 1].forEach( year => {
		
				const monthsArray = Array.from({ length: 12 }, (_, indexm) => {
					  const months = ("0"+(1 + indexm) ).slice(-2);
					  return yearMonths.push( [year.toString()+"-"+months.toString(), year+"년  "+ months + "월"] );
				});				  
		
	});
		  
	var dateList = { data	: yearMonths,targetId : obj}
	C_UICOM.makeSelectBox(dateList, "single");
	C_UICOM.setSingleBox(obj, dayjs().year()+"-"+("0"+(dayjs().month() + 1) ).slice(-2));
	
}


function _yearSelectBox (yearObj) {
	
	var yearsArrayList = { data	: _getYearDataList (),targetId : yearObj}
	C_UICOM.makeSelectBox(yearsArrayList, "single");
	C_UICOM.setSingleBox(yearObj, dayjs().year());

}

function _monthSelectBox (yearObj) {
	
	const monthsArray = Array.from({ length: 12 }, (_, index) => {
		  const months = ("0"+(1 + index) ).slice(-2);
		  return [months.toString(), months + "월"];
	});

	var monthsArrayList = { data : monthsArray,targetId : yearObj}
	C_UICOM.makeSelectBox(monthsArrayList, "single");
	C_UICOM.setSingleBox(yearObj, ("0"+(dayjs().month() + 1) ).slice(-2));

}

function _getYearDataList () {
	
	const yearsArray =  Array.from({ length: 4 }, (_, index) => {
				  const year = 2022 + index;
				  return [year.toString(), year + "년"];
	});
	
	return yearsArray ;
}

function _setSearchListCnt (targetId) {
	
    var singleboxList = { 
            data 		: C_COM.getCodeList("SEARCH_LIST_CNT")
           ,targetId 	: targetId 
	}
    
	C_UICOM.makeSelectBox(singleboxList, "single");	
}

function _getSearchListCnt (targetId) {
	
	C_UICOM.getData(targetId)
	
}

function _numberWithCommas (num) {
	
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function _chkHandler(pageId, page)
{
		
    $("#"+pageId+"_ckAll").off().on('click',function() {

    	const isAllChk =  $(this).prop("checked");
		$("[id^='"+pageId+"_ck_']").prop("checked", isAllChk);
		
    	const ckboxes = $("[id^='"+pageId+"_ck_']");
	    page.checkedItems = isAllChk ? ckboxes.map(function() { return $(this).attr("id").replace(pageId+"_ck_",""); }).get() : [];

    });

    $("[id^='"+pageId+"_ck_']").off().on('click',function() {

		const index = $(this).attr("id").replace(pageId+"_ck_","");
		if ($(this).prop("checked")){page.checkedItems.push(index);}
    	else { page.checkedItems = page.checkedItems.filter(item => item !== index);}  
        
        const $checkboxSelector = $("[id^='"+pageId+"_ck_']")
        const allCheckboxChecked = $checkboxSelector.length === $checkboxSelector.filter(":checked").length;
        $("#"+pageId+"_ckAll").prop("checked", allCheckboxChecked);
        
    });
		    
}

function _excelUpload(pageId,queryId,searchFnc)
{
	
	const fileInput = $('#'+pageId+'_excelFileInput')[0];
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    $.ajax({
        url: '/excelUpload.do',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {

        	const jsonData  = JSON.parse(response.data);

            const tableContainer = document.getElementById(pageId+'_uploadExcelResult');
            const table = document.createElement('table');
			
            const columns = [];
            const thead = document.createElement('thead');

            const theadRow = document.createElement('tr');
            for (const key in jsonData[0]) {
                if (Object.hasOwnProperty.call(jsonData[0], key)) {
                    const th = document.createElement('th');
                    th.textContent = key;
                    theadRow.appendChild(th);
                    columns.push( key );
                }
            }
            thead.appendChild(theadRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            let index = 0;
            
            for (const item of jsonData) {
            	
                const tbodyRow = document.createElement('tr');
                tbodyRow.setAttribute("name",pageId+"_excelTr_"+index++ )
                for (const column of columns) {

                    const td = document.createElement('td');
                    td.setAttribute( "id" , column );
                    td.setAttribute( "value" , item[column]  );
                    td.textContent = item[column] || '';

                    tbodyRow.appendChild(td);
                }

                tbody.appendChild(tbodyRow);
            }
            
            table.appendChild(tbody);

            tableContainer.appendChild( table);

			const $trs = $("[name^='"+pageId+"_excelTr_']");
			let paramRows = []
			
			$.each( $trs , function(rIdx) {
				
				const $tds = $("[name='"+pageId+"_excelTr_"+rIdx+"'] td");
				let param = [];	 	
				$.each( $tds , function(){
					console.log(""+this)
					const key = $(this).attr("id");
					const val = $(this).attr("value");
					param.push( { "key": key, "val": val } );
					
				})
				
				paramRows.push( param );
				
			})

			const prlength = paramRows.length;
									
			paramRows.forEach( (row,idx)  => {
				
				let newRow = {}
				row = row.map( obj =>{
					newRow[obj.key] = obj.val;
				})
				
				var parm = {
						 queryId 		: queryId
						,requestParm	: newRow
				}
	
				C_COM.requestQuery(parm, function(resultData) {
					
					if( resultData.state == 'S' &&  idx+1 >= prlength ){
							setTimeout(()=>{
								searchFnc();
							},200)					
					}				
				});
			})			       
		}
        ,error: function(error) {
	
        	 $("#result").html ( '업로드 실패' );
        }
    });
	
}	

function _memberSearchPopup (param, func){
      	
	const gubun 	= isEmpty(param.gubun)? 'USER_ID' : param.gubun ;   

	C_POP.open('popup_system_memberSearchPopup', {param:param, gubun:gubun}, function(retData) {

		if( typeof func === 'function' ){
		
			func(retData);
		}
		
	});
}

function _getBranchSelectData ( callback ) {
	
	let BRANCH_DATA = [];		
	var parm = {
			queryGroup : [
				 {
					 queryId 		: "hrInfo.getBaseBranchList"
					,requestParm	: {}
				 }
				,{
					 queryId 		: "hrInfo.getSpBranchList"
					,requestParm	: {}
				 }
				,{
					 queryId 		: "hrInfo.getBranchList"
					,requestParm	: {}
				 }
			]
	}			
	C_COM.requestQuery(parm, function(resultData) {

			if( resultData.state == "S"){

				BRANCH_DATA["BASE_BRANCH"		] = resultData.data["hrInfo.getBaseBranchList"].map( item=> [item.CODE_ID, item.CODE_NM] ) ;
				BRANCH_DATA["SP_BRANCH"			] = resultData.data["hrInfo.getSpBranchList"].map( item=> [item.CODE_ID, item.CODE_NM] ) ;
				BRANCH_DATA["BRANCH"			] = resultData.data["hrInfo.getBranchList"].map( item=> [item.CODE_ID, item.CODE_NM] ) ;
				
				callback ? callback(BRANCH_DATA) : null;
				
			}else{
				C_POP.alert(resultData.msg)
			}
	});
}

function _getImageFile (targetId , obj ,fn) {

	// image upload component
	const USER_ID = obj.GRP_FILE_ID;
	C_COMP.import("fileuploadComp", "component_compFilemng",{hide : "Y"} , function(fileId) {});
	C_COM.getFileId(obj["GRP_FILE_ID"], obj["OWNER_CD"], function(fileObjList) {
		
		if( fileObjList.length> 0){
			
			let fileId = fileObjList[0].FILE_ID;
			let imgPath = C_COM.getImageUrl(fileId);
			$("#"+targetId).attr("src", imgPath);
			
			/* header의 이미지 */
			if( USER_ID == G_VAL.session.USER_ID){
				
				G_VAL.session.userImgId = fileId;
				$("#userImg").attr("src",imgPath);
				$("#loginUserNm").text(G_VAL.session.etcUserInfo.USER_NM );

			}
		}
					
	    if (typeof fn === 'function') {
	        fn();
	    }
	});	
	
}

function _makeMultiBox(targetId, data){

	var multiboxList = { 
		 data : data
	 	,targetId : targetId 
	}
	C_UICOM.makeSelectBox(multiboxList, "multi");
}