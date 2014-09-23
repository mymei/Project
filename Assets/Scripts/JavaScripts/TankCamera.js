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

private var hit:RaycastHit = new RaycastHit();
private var raycastLayers:LayerMask = -1;

private var offset:Vector3 = Vector3.forward;
private var formerPosition:Vector3;

private var euler:Vector3 = Vector3.zero;

function Start()
{
	formerPosition = Input.mousePosition;
}
	
function LateUpdate()
{
	distance -= Input.GetAxis("Mouse ScrollWheel") * mouseWheelSensitivity;
	distance = Mathf.Min(cameraMaximumDistance, Mathf.Max(cameraMinimumDistance, distance));

	euler.x -= (Input.mousePosition.y - formerPosition.y) / mouseMoveSensitivity * Mathf.Rad2Deg;
	euler.x = Mathf.Max(cameraDropAngle, Mathf.Min(cameraElevateAngle, euler.x));
	euler.y += (Input.mousePosition.x - formerPosition.x) / mouseMoveSensitivity * Mathf.Rad2Deg;

	offset = Quaternion.Euler(euler) * Vector3.forward;
	
	var newTargetPosition = target.position + Vector3.up * height;
	var newPosition = newTargetPosition - (offset * distance);

	var targetDirection = newPosition - newTargetPosition;
	
	if (formerPosition != Input.mousePosition) {
		target.BroadcastMessage("AimControl", newTargetPosition + (offset * 10), SendMessageOptions.DontRequireReceiver);
	}
	formerPosition = Input.mousePosition;
	
	if(Physics.Raycast(newTargetPosition, targetDirection, hit, distance, raycastLayers))
		newPosition = hit.point;
	
	transform.position = newPosition;
	transform.LookAt(newTargetPosition);
}