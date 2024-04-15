package exdev.com.service;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import exdev.com.ExdevCommonAPI;
import exdev.com.common.dao.ExdevCommonDao;
import exdev.com.common.service.ExdevBaseService;
import exdev.com.common.service.ExdevCommonService;

/**
 * This MovieServiceImpl class is an Implementation class to provide movie crud
 * functionality.
 * 
 * @author 위성열
 */
@Service("ApprovalAfterService")
public class ApprovalAfterService extends ExdevBaseService{
	
	
	@Autowired
	private ExdevCommonService	exdevCommonService;
	
	@Autowired
	private EmailService 		emailService;
	
	@Autowired
    private ApprovalService 	approvalService;

    @Autowired
    private ScheduleService 	scheduleService;
	
	@Autowired
	private ExdevCommonDao		commonDao;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Map approvalAfterProcess(Map map) throws Exception {
		
    	Map appInfo = (Map)commonDao.getObject("approval.getApproval", map);
    	
    	String AFTER_SERVICE 	= (String)appInfo.get("AFTER_SERVICE");
    	String AFTER_PARM 		= (String)appInfo.get("AFTER_PARM");
    	
    	if(!ExdevCommonAPI.isValid(AFTER_SERVICE)) {
    		return map;
    	}
    	
    	if(!ExdevCommonAPI.isValid(AFTER_PARM)) {
    		AFTER_PARM = "{}";
    	}
    	
    	 // ObjectMapper 객체 생성
        ObjectMapper objectMapper = new ObjectMapper();

        // JSON 문자열을 Map으로 변환
        Map<String, Object> afterParmMap = objectMapper.readValue(AFTER_PARM, Map.class);
        
        map.putAll(afterParmMap);
        
		String [] token = AFTER_SERVICE.split("\\.");
		
		String classId 		= token[0];
		String methodId 	= token[1];
		
		Method targetMethod = null;
		Object targetService = null;
        
		if("ApprovalAfterService".equals(classId)) {
			targetService = this;
			targetMethod = ApprovalAfterService.class.getMethod(methodId, Map.class);
		} else if("ExdevCommonService".equals(classId)) {
			targetService = exdevCommonService;
			targetMethod = ExdevCommonService.class.getMethod(methodId, Map.class);
		} else if("EmailService".equals(classId)) {
			targetService = emailService;
			targetMethod = EmailService.class.getMethod(methodId, Map.class);
		} else if("ApprovalService".equals(classId)) {
            targetService = approvalService;
            targetMethod = ApprovalService.class.getMethod(methodId, Map.class);
        } else if("ScheduleService".equals(classId)) {
            targetService = scheduleService;
            targetMethod = ScheduleService.class.getMethod(methodId, Map.class);
        }
			
		Map resultObject = (Map)targetMethod.invoke(targetService, map);
		
		return resultObject;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map updateProjectProcess(Map map) throws Exception {
		
		map.put("CONTRACT_ID", map.get("APPROVAL_ID"));
		
        int result = commonDao.update("contract.updateProject", map);
		
		return map;
	}
	
	
}
