

function _excelDownload ( $hds ,$tds,requestParm , title)  {

		let excelColumnNames =  [];
		$.each( $hds, function(){
			$(this).text() ? 
					excelColumnNames.push( $(this).text() ):'';
		})
		
		let excelColumnOrder =  [];
		$.each( $tds, function(){
			$(this).attr("id") ? 
				$(this).css('display') !== 'none' ?
					excelColumnOrder.push( $(this).attr("id") ):'':'';
		})

		let excelParam = {};
		excelParam["queryId"]		  = requestParm.queryId; 
		excelParam["columnOrders"	] = excelColumnOrder;
		excelParam["downInfo"		] = JSON.stringify({  title : title, menu : title});
		excelParam["requestParm"	] = JSON.stringify(requestParm.requestParm );
		excelParam["columnNames"	] = excelColumnNames;
		
	    var xhr = new XMLHttpRequest();
	    var urlParams = new URLSearchParams( excelParam ).toString();
	    xhr.open('GET', '/excelDownload.do?'+urlParams, true);
	    xhr.responseType = 'blob';

	    xhr.onload = function() {
	    	
	        if (xhr.status === 200) {

	            var blob = new Blob([xhr.response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
	            var url = window.URL.createObjectURL(blob);
	            
	            var a = document.createElement('a');
	            a.href = url;
	            a.download = title+'.xlsx';
	            
	            document.body.appendChild(a);
	            a.click();
	            window.URL.revokeObjectURL(url);
	            
	        } else {
	        	
	            console.error('Failed to download excel file');
	            
	        }
	    };
	    
	    xhr.send();
}
