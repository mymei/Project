#pragma strict

var turretList:Transform[];

private var gunnerEye:Transform;

function Start () {
}

function Update () {
	for (var i = 0; i < turretList.length; i ++) {
		if (Input.GetKey(KeyCode.Alpha1 + i)) {
			MoveDriver(turretList[i]);
			break;		
		}
	}
}

function ResetGunner() {
	for (var turret:Transform in turretList) {
		if (turret != null) {
			turret.SendMessage("ResetEye", SendMessageOptions.DontRequireReceiver); 
		}
	}
}

function SetEye(eye:Transform) {
	gunnerEye = eye;
	if (turretList[0] != null) {
		MoveDriver(turretList[0]);
	}
}

function MoveDriver(turret:Transform) {
	if (turret != null && gunnerEye != null) {
		ResetGunner();
		turret.SendMessage("SetEye", gunnerEye, SendMessageOptions.DontRequireReceiver); 
		gunnerEye.SendMessage("SetTarget", turret, SendMessageOptions.DontRequireReceiver); 
	}
}