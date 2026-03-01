use crate::tun;

#[tauri::command]
pub async fn tun_start(config: String) -> Result<(), String>
{
    let result = tun::tun2socks_start(config);

    println!("tun_start Result: {} -- {}", result.is_ok(), result.is_err());

    Ok(())
}

#[tauri::command]
pub async fn tun_stop() -> Result<(), String>
{
    println!("tun_stop was invoked from JavaScript!");

    tun::socks_stop().expect("Failed to tun_stop");

    Ok(())
}
