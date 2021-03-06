﻿#pragma strict

var turretTraverse : float = 30;
var elevationSpeed : float = 30;

var depression : float = -10;
var elevation :float = 20;

var aimPos:Vector3;
var aimTarget:Transform = null;

var ignoreLayers:LayerMask = -1;

private var hit:RaycastHit = new RaycastHit();
private var raycastLayers:LayerMask = -1;

private var actualTargetPos:Vector3;

function AimControl(targetPos:Vector3) {
	aimPos = targetPos;
	aimTarget = aimTarget==null?transform:aimTarget;
}

function lockOn(target:Transform) {
	if (target == null) {
		aimTarget = aimTarget == transform?transform:null;
	} else {
		aimTarget = aimTarget!=target?target:null;
	}
}

function isAiming() : boolean {
	return aimTarget!=null;
}

function getAimPos():Vector3 {
	return aimTarget!=null && aimTarget != transform?aimTarget.position:aimPos;
}

function Start () {
	var tmp:int = ignoreLayers;
	raycastLayers = ~tmp;
}

function Update () {
	if (isAiming()) {
		var _aimPos = getAimPos();

		var jointTransform = transform.Find("Joint").transform;

		var tmpPos:Vector3 = transform.parent.InverseTransformPoint(_aimPos);
		
		var lookRotation = Quaternion.LookRotation(tmpPos - transform.localPosition);
		
		transform.localRotation.eulerAngles.y = Mathf.MoveTowardsAngle(transform.localRotation.eulerAngles.y, lookRotation.eulerAngles.y, Time.deltaTime * turretTraverse);
		
		var tmp = lookRotation.eulerAngles.x;
		tmp = tmp > 180?Mathf.Max(360 - elevation, tmp):tmp;
		tmp = tmp <= 180?Mathf.Min(-depression, tmp):tmp;	
		
		jointTransform.localRotation.eulerAngles.x = 
		Mathf.MoveTowardsAngle(jointTransform.localRotation.eulerAngles.x, tmp, Time.deltaTime * elevationSpeed); 	
		
		var currentTargetPos = transform.position + transform.Find("Joint").forward * 500;
		if(Physics.Raycast(transform.position, transform.Find("Joint").forward, hit, 500, -1)) {
			currentTargetPos = hit.point;
		}
		actualTargetPos = Vector3.Lerp(actualTargetPos, currentTargetPos, 0.8);	
	}
}

function GetTargetPos() {
	return actualTargetPos;
}