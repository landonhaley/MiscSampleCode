using UnityEngine;
using System.Collections;

public class GoalClass : MonoBehaviour {


	public PlayerData.Country country;
	public int goalNum;
	private GameObject[] players;

	// Use this for initialization
	void Start () {

		players = GameObject.FindGameObjectsWithTag("Player");
		foreach (GameObject player in players) {
			if (player.gameObject.GetComponent<PlayerClass>().Data.PlayerNum < 2 && goalNum == 1)
				country = player.gameObject.GetComponent<PlayerClass>().Data.PlayerCountry;
			else if (player.gameObject.GetComponent<PlayerClass>().Data.PlayerNum >= 2 && goalNum == 2)
				country = player.gameObject.GetComponent<PlayerClass>().Data.PlayerCountry;
		}
	}


	// Update is called once per frame
	void Update () { 

	}

	public void PointScored(GameObject playerWhoScored){
		GameObject.Find ("Main Camera").GetComponent<CameraShake> ().shake = 1f; 
		PlayerData.Country playerCountry = playerWhoScored.gameObject.GetComponent<PlayerClass> ().Data.PlayerCountry;
		if (country != playerCountry) {
			playerWhoScored.gameObject.GetComponent<PlayerClass> ().Data.PlayerScore++;
			if (playerWhoScored.gameObject.GetComponent<PlayerClass> ().Data.PlayerNum < 2) {
				ControlCenter.Instance.Team1Score++;
				Debug.Log("Team 1 Score: " + ControlCenter.Instance.Team1Score);
			} else {
				ControlCenter.Instance.Team2Score++;
				Debug.Log("Team 2 Score: " + ControlCenter.Instance.Team2Score);
			}
		} 
		else {
			if (playerWhoScored.gameObject.GetComponent<PlayerClass> ().Data.PlayerNum < 2){
				ControlCenter.Instance.Team2Score++;
				Debug.Log("Team 2 Score: " + ControlCenter.Instance.Team2Score);
			}
			else{
				ControlCenter.Instance.Team1Score++;
				Debug.Log("Team 1 Score: " + ControlCenter.Instance.Team1Score);
			}
		}
	}
}
