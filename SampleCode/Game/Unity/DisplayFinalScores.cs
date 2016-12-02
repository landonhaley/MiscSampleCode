using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;

public class DisplayFinalScores : MonoBehaviour {

	public List<PlayerData> _playerData;
	private PlayerData.Country winningCountry;
	public Sprite[] winningFlags;
	public Sprite[] flags;
	private GameObject[] players;
	public GameObject WinningTeam;
	public GameObject Team1Score;
	public GameObject Team2Score;
	public GameObject Team1Flag;
	public GameObject Team2Flag;
	public GameObject P1Score;
	public GameObject P2Score;
	public GameObject P3Score;
	public GameObject P4Score;

	// Use this for initialization
	void Start () {
		DefineTeamStats ();
	}
	
	// Update is called once per frame
	void Update () {
	}

	void DefineTeamStats (){
		_playerData = ControlCenter.Instance._playerData;
		int T1Score = ControlCenter.Instance.Team1Score;
		int T2Score = ControlCenter.Instance.Team2Score;
		if (T1Score > T2Score)
			FindWinningCountry ("Team 1");
		else if (T2Score > T1Score)
			FindWinningCountry ("Team 2");
		else 
			FindWinningCountry ("Tie");
		DisplayTotals (T1Score,T2Score);
	}

	void DisplayTotals(int T1Score, int T2Score){
		Team1Score.GetComponent<Text> ().text = "" + T1Score + "";
		Team2Score.GetComponent<Text> ().text = "" + T2Score + "";
	}

	void FindWinningCountry(string winner){
		Debug.Log (winner);
		if (winner == "Tie") {
			Tie ();
		} else {
			foreach (PlayerData player in _playerData) {
				if (player.PlayerNum < 2 && winner == "Team 1") {
					winningCountry = player.PlayerCountry;
					DisplayWinner (winningCountry);
				} else if (player.PlayerNum >= 2 && winner == "Team 2") {
					winningCountry = player.PlayerCountry;
					DisplayWinner (winningCountry);
				}
			}
		}
		LoadTeam1Data ();
		LoadTeam2Data ();
	}

	void DisplayWinner(PlayerData.Country winningCountry){
		if (winningCountry == PlayerData.Country.USA) {
			WinningTeam.GetComponent<Image> ().sprite = winningFlags[0];
		}
		else if (winningCountry == PlayerData.Country.Japan) {
			WinningTeam.GetComponent<Image> ().sprite = winningFlags[2];
		}
		else if (winningCountry == PlayerData.Country.China) {
			WinningTeam.GetComponent<Image> ().sprite = winningFlags[1];
		}
		else if (winningCountry == PlayerData.Country.Russia) {
			WinningTeam.GetComponent<Image> ().sprite = winningFlags[3];
		}
	}

	void Tie(){
		WinningTeam.GetComponent<Image> ().sprite = winningFlags[4];
	}

	void LoadTeam1Data(){
		foreach (PlayerData player in _playerData) {
			PlayerData.Country team1country;
			if (player.PlayerNum == 0){
				P1Score.GetComponent<Text> ().text = "" + player.PlayerScore + "";
				team1country = player.PlayerCountry;
				loadTeamFlag(team1country, Team1Flag);
			}
			else if (player.PlayerNum == 1){
				P2Score.GetComponent<Text> ().text = "" + player.PlayerScore + "";
			}
		}
	}

	void LoadTeam2Data(){
		foreach (PlayerData player in _playerData) {
			PlayerData.Country team2country;
			if (player.PlayerNum == 2){
				P3Score.GetComponent<Text> ().text = "" + player.PlayerScore + "";
				team2country = player.PlayerCountry;
				loadTeamFlag(team2country, Team2Flag);
			}
			else if (player.PlayerNum == 3){
				P4Score.GetComponent<Text> ().text = "" + player.PlayerScore + "";
			}
		}
	}

	void loadTeamFlag(PlayerData.Country country, GameObject teamFlag){
		if (country == PlayerData.Country.USA) {
			teamFlag.GetComponent<Image> ().sprite = flags[0];
		}
		else if (country == PlayerData.Country.Japan) {
			teamFlag.GetComponent<Image> ().sprite = flags[2];
		}
		else if (country == PlayerData.Country.China) {
			teamFlag.GetComponent<Image> ().sprite = flags[1];
		}
		else if (country == PlayerData.Country.Russia) {
			teamFlag.GetComponent<Image> ().sprite = flags[3];
		}
	}


}
