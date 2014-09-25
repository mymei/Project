#pragma strict

var target:Transform;
var height:float = 5f;
var distance:float = 4f;

var mouseWheelSensitivity = 1f;
var mouseMoveSensitivity = 100f;

var cameraMinimumDistance = 1f;
var cameraMaximumDistance = 10f;

var cameraElevateAngle = 85;
var cameraDropAngle = -20;

var ignoreLayers:LayerMask = -1;

var targetTexture:Texture;

private var hit:RaycastHit = new RaycastHit();
private var raycastLayers:LayerMask = -1;

private var offset:Vector3 = Vector3.forward;
private var formerPosition:Vector3;

private var euler:Vector3 = Vector3.zero;

private var targetDistance = distance;

private var tmpSpeed = 0.0;

function Start()
{
	formerPosition = Input.mousePosition;
	var tmp:int = ignoreLayers;
	raycastLayers = ~tmp;
}
	
function LateUpdate()
{
	targetDistance -= Input.GetAxis("Mouse ScrollWheel") * mouseWheelSensitivity;
	targetDistance = Mathf.Min(cameraMaximumDistance, Mathf.Max(cameraMinimumDistance, targetDistance));
	
	distance = Mathf.SmoothDamp(distance, targetDistance, tmpSpeed, 0.3f);

	var currentPosition = Input.mousePosition;
	if (!new Rect(0, 0, Screen.width, Screen.height).Contains(currentPosition)) {
		currentPosition = formerPosition;
	}

	euler.x -= (currentPosition.y - formerPosition.y) / mouseMoveSensitivity * Mathf.Rad2Deg;
	euler.x = Mathf.Max(cameraDropAngle, Mathf.Min(cameraElevateAngle, euler.x));
	euler.y += (currentPosition.x - formerPosition.x) / mouseMoveSensitivity * Mathf.Rad2Deg;

	offset = Quaternion.Euler(euler) * Vector3.forward;
	
	if (cameraMinimumDistance == targetDistance) {
		var newTargetPosition = target.position;
		var newPosition = newTargetPosition - offset * 0.1;		
	} else {
		newTargetPosition = target.position + Vector3.up * (height + Mathf.Tan(5 * Mathf.Deg2Rad) * distance);
		newPosition = newTargetPosition - (offset * distance);	
	}

	var targetDirection = newPosition - newTargetPosition;
	
	var goal = newTargetPosition + (offset * 500);
	if (Physics.Raycast(newTargetPosition, offset, hit, 500, raycastLayers)) {
		goal = hit.point;			
	}		
	target.BroadcastMessage("AimControl", goal, SendMessageOptions.DontRequireReceiver);
	
	formerPosition = currentPosition;
	
	if(Physics.Raycast(newTargetPosition, targetDirection, hit, distance, raycastLayers))
		newPosition = hit.point;
	
	transform.position = newPosition;
	transform.LookAt(newTargetPosition);
}

function OnGUI() {
	var tmp:TurretController = target.GetComponent("TurretController");
	var screenPos = camera.WorldToScreenPoint(tmp.GetTargetPos());
	GUI.Box(Rect(screenPos.x - 32, (Screen.height - screenPos.y) - 32, 64, 64), targetTexture);
}