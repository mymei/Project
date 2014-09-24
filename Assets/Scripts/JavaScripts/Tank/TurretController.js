#pragma strict

var turretTraverse : float = 30;
var elevationSpeed : float = 30;

var depression : float = -10;
var elevation :float = 20;

private var targetAimPos:Vector3;

function AimControl(targetPos:Vector3) {
	targetAimPos = targetPos;
}

function Start () {

}

function Update () {
	var jointTransform = transform.Find("Joint").transform;

	var tmpPos:Vector3 = transform.parent.InverseTransformPoint(targetAimPos);
	
	var lookRotation = Quaternion.LookRotation(tmpPos - transform.localPosition);
	
	transform.localRotation.eulerAngles.y = Mathf.MoveTowardsAngle(transform.localRotation.eulerAngles.y, lookRotation.eulerAngles.y, Time.deltaTime * turretTraverse);
	
	var tmp = lookRotation.eulerAngles.x;
	tmp = tmp > 180?Mathf.Max(360 - elevation, tmp):tmp;
	tmp = tmp <= 180?Mathf.Min(-depression, tmp):tmp;	
	
	jointTransform.localRotation.eulerAngles.x = 
	Mathf.MoveTowardsAngle(jointTransform.localRotation.eulerAngles.x, tmp, Time.deltaTime * elevationSpeed); 
}